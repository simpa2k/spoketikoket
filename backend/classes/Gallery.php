<?php
class Gallery {

    private $path,
            $galleryName,
            $thumbnailPath,
            $galleryCoverPath,
            $metaData,
            $metaDataPath;

    private static $thumbWidth = 256;
    private static $galleryCoverWidth = 540;
    private static $acceptedFormats = array('jpg');
    
    public function __construct($path, $metaData, $createDirectoryStructure = false) {

        $this->setPaths($path);

        if($createDirectoryStructure && !file_exists($this->path)) {
            $this->createGallery($metaData);
        }

    }

    private function setPaths($path) {

        $this->path = $path;
        $this->galleryName = basename($path);
        $this->thumbnailPath = $path . '/thumbnails/';
        $this->galleryCoverPath = $path . '/galleryCover/';
        $this->metaDataPath = $path . '/metadata.json';
        
    }

    private function createGallery($metaData) {

        mkdir($this->path);
        mkdir($this->thumbnailPath); 
        mkdir($this->galleryCoverPath); 

        if($metaData != null) {
            $this->setMetaData($metaData);
        }

    }

    
    public function setPath($path) {
        
        if(substr($path, -1) === '/') {
            $path = substr($path, 0, -1);
        }
        
        $this->path = $path;
    }

    public function setThumbWidth($width) {

        self::$thumbWidth = $width;

    }

    public function setGalleryCoverWidth($width) {

        self::$galleryCoverWidth = $width;

    }

    private function shouldBeIgnored($filename) {

        switch($filename) {
            case ".":
            case "..":
            case "metadata.json":
                return true;
            default:
                return false;
        }

    }
    
    private function getDirectory($path) {

        $contents = array();

        foreach (scandir($path) as $filename) {

            if($this->shouldBeIgnored($filename)) {
                continue;
            }

            $filePath = $path . $filename;
            $contents[] = $filePath;

        }

        return $contents;
    }

    private function isEmptyDirectory($directoryPath) {

        if(!is_readable($directoryPath)) {
            return null;
        }

        $directory = opendir($directoryPath);

        while(($filename = readdir($directory)) !== false) {
            if( ($filename != ".") && ($filename != "..") ) {
                return false;
            }
        }
        return true;

    }

    private function pruneLeadingDotsAndSlash($path) {

        if(strlen($path) > 2 && $path[0] == '.' && $path[1] == '.' && $path[2] == '/') {
            return substr($path, 3);
        } else {
            return $path;
        }
        
    }

    public function setName($newName) {

        $metaData = $this->getMetaData();
        $metaData->galleryname = $newName;

        $this->setMetaData($metaData);

        $pathInfo = pathinfo($this->path);
        $parentDir = $pathInfo['dirname'];

        $newDir = $parentDir . '/' . $newName;

        rename($this->path, $newDir);

        $this->setPaths($newDir);
        
    }

    public function getName() {
        return $this->galleryName;
    }

    public function addImage($filePath, $filename = null) {

        /* 
         * If the filename is not specified, assume that
         * it is possible to derive it from the file path given.
         */

        if($filename == null) {
            $filename = basename($filePath);
        }

        $filename = $this->path . '/' . $filename;
        
        $success = move_uploaded_file($filePath, $filename);
        $this->createThumbnail($filename);

        if($this->isEmptyDirectory($this->galleryCoverPath)) {
            $this->setGalleryCover($filename);
        }

        return $success;

    }

    public function getImages($extensions = array('jpg', 'png')) {

        $images = scandir($this->path);

        $galleryCover = $this->getGalleryCover();
        $galleryCoverName = basename($galleryCover);
        $galleryCoverFound = false;
        
        foreach($images as $index => $image) {
            $exploded_image = explode('.', $image);
            $extension = strtolower(end($exploded_image));
            
            if(!in_array($extension, $extensions)) {
                unset($images[$index]);
            } else {
                $images[$index] = array(
                    'full' => $this->pruneLeadingDotsAndSlash($this->path . '/' . $image),
                    'thumb' => $this->pruneLeadingDotsAndSlash($this->thumbnailPath . $image)
                );

                /*if( (!$galleryCoverFound) && ($image == $galleryCoverName) ) {
                    $images[$index]['galleryCover'] = $galleryCover;
                    $galleryCoverFound = true;
                }*/
            }
        }
        
        return (count($images)) ? $images : false;
    }

    public function setMetaData($metaData) {

        /*
         * Encoding and decoding json like this might be inefficient
         * but at least it always guarantees the correct format
         */
        $encodedMetaData = json_encode($metaData);
        file_put_contents($this->metaDataPath, $encodedMetaData);
        $this->metaData = $metaData;

    }

    public function getMetaData() {

        if($this->metaData == null) {
            $this->metaData = json_decode(file_get_contents($this->metaDataPath));
        }

        return $this->metaData;

    }

    private function createResizedImageCopy($imagePath, $widthOfCopy, $outputPath) {

        $fname = basename($imagePath);
        
        // load image and get image size
        $img = imagecreatefromjpeg( "{$imagePath}" );
        $width = imagesx( $img );
        $height = imagesy( $img );

        // calculate new size
        $new_width = $widthOfCopy;
        $new_height = floor( $height * ( $widthOfCopy / $width ) );

        // create a new temporary image
        $tmp_img = imagecreatetruecolor( $new_width, $new_height );

        // copy and resize old image into new image
        imagecopyresampled( $tmp_img, $img, 0, 0, 0, 0, $new_width, $new_height, $width, $height );

        // save resized image to file
        $success = imagejpeg( $tmp_img, "{$outputPath}{$fname}" );

        imagedestroy($tmp_img);
        
    }

    private function performOnDirectoryContents($directoryPath, $acceptedExtensions, $callback) {

        if(is_dir($directoryPath)) {

            if($dir = opendir($directoryPath)) {

                while(($filename = readdir($dir)) !== false) {

                    $filePath = $directoryPath . $filename;
                    
                    $info = pathinfo($filePath);
                    $extension = $info['extension'];

                    if(in_array($extension, $acceptedExtensions)) {

                        $callback($filePath);

                    }
                }
                closedir($dir);

            }
        }
    }

    public function setGalleryCover($imagePath) {

        $imageName = basename($imagePath);

        if(is_dir($this->galleryCoverPath)) {

            $this->performOnDirectoryContents($this->galleryCoverPath, self::$acceptedFormats, function($existingGalleryCover) use($imageName) {

                if($imageName != basename($existingGalleryCover)) {
                   unlink($existingGalleryCover); 
               }

            });

        } else {
            mkdir($this->galleryCoverPath);
        }

        $this->createResizedImageCopy($this->path . '/' . $imageName, self::$galleryCoverWidth, $this->galleryCoverPath);
        
    }

    public function getGalleryCover() {

        $galleryCover = $this->getDirectory($this->galleryCoverPath);

        if(empty($galleryCover)) {
            return null;
        } else {
            return $this->pruneLeadingDotsAndSlash($galleryCover[0]);
        }

    }

    public function createThumbnail($imagePath) {

        $this->createResizedImageCopy($imagePath, self::$thumbWidth, $this->thumbnailPath);

    }

    public function createThumbnails($pathToImages) {
        
        $this->performOnDirectoryContents($pathToImages, self::$acceptedFormats, function($fullSizedImage) {

            $this->createThumbnail($fullSizedImage);

        });

    }

    private function deleteRecursively($path) {

        $files = array_diff(scandir($path), array('.', '..'));

        foreach ($files as $file) {
           is_dir("$path/$file") ? $this->deleteRecursively("$path/$file") : unlink("$path/$file"); 
        }

        return rmdir($path);

    }

    public function delete() {

        return $this->deleteRecursively($this->path);

    }
    
    public function getPosition($files = array()) {
        foreach($files as $position => $image) {
            return $position;
        }
    }
}
