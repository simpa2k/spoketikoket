<?php
class Gallery {

    private $path,
            $galleryName,
            $thumbnailPath,
            $metaData,
            $metaDataPath;

    private static $thumbWidth = 256;
    
    public function __construct($path, $metadata, $createDirectoryStructure = false) {
        //$this->path = __DIR__ . '/images';
        $this->path = $path;
        $this->galleryName = basename($path);
        $this->thumbnailPath = $path . '/thumbnails/';
        $this->metaDataPath = $path . '/metadata.json';

        if($createDirectoryStructure && !file_exists($this->path)) {
            $this->createGallery($metaData);
        }

    }

    private function createGallery($metaData) {
        mkdir($this->path);
        mkdir($this->thumbnailPath); 

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
    
    private function getDirectory($path) {
        return scandir($path);
    }

    public function getName()
    {
        return $this->galleryName;
    }
    
    public function addImage($filePath, $filename = null) {

        /* 
         * If the filename is not specified we will assume that
         * it is possible to derive it from the file path given.
         */

        if($filename == null) {
            $filename = basename($filePath);
        }

        $filename = $this->path . '/' . $filename;
        file_put_contents('debug.txt', var_export($filename, true), FILE_APPEND);
        
        $success = move_uploaded_file($filePath, $filename);
        $this->createThumbnail($filename, self::$thumbWidth);

    }

    public function getImages($extensions = array('jpg', 'png')) {
        $images = $this->getDirectory($this->path);
        
        foreach($images as $index => $image) {
            $exploded_image = explode('.', $image);
            $extension = strtolower(end($exploded_image));
            
            if(!in_array($extension, $extensions)) {
                unset($images[$index]);
            } else {
                $images[$index] = array(
                    'full' => $this->path . '/' . $image,
                    //'thumb' => $this->path . '/thumbnails/' . $image
                    'thumb' => $this->path . $this->thumbnailPath . $image
                );
            }
        }
        
        return (count($images)) ? $images : false;
    }

    public function setMetaData($metaData) {

        /*
         * Encoding and decoding json like this might be inefficient
         * but at least it always guarantees the correct format
         */
        file_put_contents(json_encode($metaData), $this->metaDataPath);
        $this->metaData = json_decode($metaData);

    }

    public function getMetadata() {

        if($this->metaData == null) {
            $this->metaData = json_decode(file_get_contents($this->metaDataPath));
        }

        return $this->metaData;

    }

    //public function createThumbnail($imagePath, $pathToThumbs, $thumbWidth) {
    public function createThumbnail($imagePath, $thumbWidth) {

        $fname = basename($imagePath);
        
        // load image and get image size
        $img = imagecreatefromjpeg( "{$imagePath}" );
        $width = imagesx( $img );
        $height = imagesy( $img );

        // calculate thumbnail size
        $new_width = $thumbWidth;
        $new_height = floor( $height * ( $thumbWidth / $width ) );

        // create a new temporary image
        $tmp_img = imagecreatetruecolor( $new_width, $new_height );

        // copy and resize old image into new image
        imagecopyresampled( $tmp_img, $img, 0, 0, 0, 0, $new_width, $new_height, $width, $height );

        // save thumbnail into a file
        imagejpeg( $tmp_img, "{$this->thumbnailPath}{$fname}" );

    }

    //public function createThumbnails($pathToImages, $pathToThumbs, $thumbWidth ) {
    public function createThumbnails($pathToImages, $thumbWidth ) {
        
        //open the directory
        $dir = opendir( $pathToImages );
        
        // loop through it, looking for any/all JPG files:
        while (false !== ($fname = readdir( $dir ))) {
            // parse path for the extension
            $info = pathinfo( $pathToImages . $fname );
            
            // continue only if this is a JPEG image
            if ( (strtolower($info['extension']) == 'jpg') ) {
                //$this->createThumbnail($pathToImages . $fname, $pathToThumbs, $thumbWidth);
                $this->createThumbnail($pathToImages . $fname, $thumbWidth);
            }
        }
        // close the directory
        closedir( $dir );
    }
    
    public function getPosition($files = array()) {
        foreach($files as $position => $image) {
            return $position;
        }
    }
}
