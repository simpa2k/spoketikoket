<?php
class Gallery {

    private $path,
            $galleryName,
            $thumbnailPath,
            $metaData,
            $metaDataPath;

    private static $thumbWidth = 256;
    private static $galleryCoverWidth = 540;
    private static $acceptedFormats = array('jpg');
    
    public function __construct($path, $metadata, $createDirectoryStructure = false) {
        $this->path = $path;
        $this->galleryName = basename($path);
        $this->thumbnailPath = $path . '/thumbnails/';
        $this->galleryCoverPath = $path . '/gallerycover/';
        $this->metaDataPath = $path . '/metadata.json';

        if($createDirectoryStructure && !file_exists($this->path)) {
            $this->createGallery($metaData);
        }

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
            return NULL;
        }

        $directory = opendir($directoryPath);

        while(($filename == readdir($directory)) !== false) {
            if( ($filename != ".") && ($filename != "..") ) {
                return false;
            }
        }
        return true;

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
                    'full' => $this->path . '/' . $image,
                    //'thumb' => $this->path . '/thumbnails/' . $image
                    'thumb' => $this->thumbnailPath . $image
                );

                if( (!$galleryCoverFound) && ($image == $galleryCoverName) ) {
                    $images[$index]['gallerycover'] = $galleryCover;
                    $galleryCoverFound = true;
                } 
            }
        }
        
        return (count($images)) ? $images : false;
    }

    public function setMetaData($metaData) {

        /*
         * Encoding and decoding json like this might be inefficient
         * but at least it always guarantees the correct format
         */
        $this->metaData = json_decode($metaData);

    }

    public function getMetadata() {

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

        $dir = opendir($directoryPath);

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

    public function setGalleryCover($imagePath) {

        $this->performOnDirectoryContents($this->galleryCoverPath, self::$acceptedFormats, function($existingGalleryCover) {
            
           unlink($existingGalleryCover); 

        });

        $this->createResizedImageCopy($imagePath, self::$galleryCoverWidth, $this->galleryCoverPath);
        
    }

    public function getGalleryCover() {
        return $this->getDirectory($this->galleryCoverPath)[0];
    }

    public function createThumbnail($imagePath) {

        $this->createResizedImageCopy($imagePath, self::$thumbWidth, $this->thumbnailPath);

    }

    public function createThumbnails($pathToImages) {
        
        $this->performOnDirectoryContents($pathToImages, self::$acceptedFormats, function($fullSizedImage) {

            $this->createThumbnail($fullSizedImage);

        });

        //open the directory
        //$dir = opendir( $pathToImages );
        
        // loop through it, looking for any/all JPG files:
        //while (false !== ($fname = readdir( $dir ))) {
            // parse path for the extension
            //$info = pathinfo( $pathToImages . $fname );
            
            // continue only if this is a JPEG image
            //if ( (strtolower($info['extension']) == 'jpg') ) {
                //$this->createThumbnail($pathToImages . $fname);
            //}
        //}
        // close the directory
        //closedir( $dir );
    }
    
    public function getPosition($files = array()) {
        foreach($files as $position => $image) {
            return $position;
        }
    }
}
