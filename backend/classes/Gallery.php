<?php
class Gallery {

    private $path,
            $galleryName;
    
    public function __construct($path) {
        //$this->path = __DIR__ . '/images';
        $this->path = $path;
        $this->galleryName = basename($path);
    }
    
    public function setPath($path) {
        
        if(substr($path, -1) === '/') {
            $path = substr($path, 0, -1);
        }
        
        $this->path = $path;
    }
    
    private function getDirectory($path) {
        return scandir($path);
    }

    public function getName()
    {
        return $this->galleryName;
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
                    'thumb' => $this->path . '/thumbnails/' . $image
                );
            }
        }
        
        return (count($images)) ? $images : false;
    }

    public function getMetadata() {
        return json_decode(file_get_contents($this->path . '/metadata.json'));
    }

    public function createThumbnail($imagePath, $pathToThumbs, $thumbWidth) {

        $fname = basename($imagePath);
        
        $debug = fopen('debug.txt', 'w');
        fwrite($debug, var_export("{$pathToThumbs}{$fname}", true));
        fclose($debug);
        
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
        imagejpeg( $tmp_img, "{$pathToThumbs}{$fname}" );

    }

    public function createThumbnails($pathToImages, $pathToThumbs, $thumbWidth ) {
        
        //open the directory
        $dir = opendir( $pathToImages );
        
        // loop through it, looking for any/all JPG files:
        while (false !== ($fname = readdir( $dir ))) {
            // parse path for the extension
            $info = pathinfo( $pathToImages . $fname );
            
            // continue only if this is a JPEG image
            if ( (strtolower($info['extension']) == 'jpg') ) {
                $this->createThumbnail($pathToImages . $fname, $pathToThumbs, $thumbWidth);
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
