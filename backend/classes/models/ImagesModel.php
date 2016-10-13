<?php

require_once('core/init.php');

/**
 *
 * Class providing methods for operating
 * on the image table
 *
 */

require_once('core/init.php');

class ImagesModel extends BaseModel {

    private $gallery,
            $galleriesPath;

    public function __construct() {

        parent::__construct();

        $this->gallery = new Gallery();
        $this->gallery->setPath("../images/");
        $this->galleriesPath = "../images/galleries/";

    }

    /**
     *
     * Method for getting data
     * based on some criteria.
     *
     * @param mixed[] $where An array of sub-arrays
     * where each sub-array represents a database column. Sub-array[0] contains
     * a database column name, sub-array[1] contains an operator and sub-array[2]
     * contains a value to be matched.
     *
     */

    public function get($where) {
    
        /* Not implemented */
    
    }

    /**
     *
     * Method for getting all data in the image table.
     *
     */

	public function getAll() {

        return $this->gallery->getImages();

    }
    
    private function shouldBeIgnored($directory) {

        switch($directory) {
            case ".":
            case "..":
            case "metadata.json":
                return true;
            default:
                return false;
        }

    }
    
    private function readDirectoryContents($directory) {

        $contents = array();

        foreach(scandir($directory) as $file) {

            if($this->shouldBeIgnored($file)) {
                continue;
            }

            $contents[] = $directory . '/' . $file;

        }
        return $contents;

    }

    private function readDirectoryMetaData($directory) {

        $metadataFilePath = $directory . '/metadata.json';

        $metadata = fopen($metadataFilePath, 'r');
        $data = fread($metadata, filesize($metadataFilePath));
        fclose($metadata);

        $data = json_decode($data);

        return $data;

    }

    private function getFilePathsConditionally($parentDirectory, $where, $fileDirectory = "") {

        $results = array();

        foreach(scandir($parentDirectory) as $directory) {

            if($this->shouldBeIgnored($directory)) {
                continue;
            }

            $data = $this->readDirectoryMetaData($parentDirectory . $directory);

            foreach($where as $queryParameter) {
                if(!(isset($data->$queryParameter[0])) || $data->$queryParameter[0] != $queryParameter[2]) {
                    continue 2;
                }
            }

            $fileDirectory = $parentDirectory . $directory . $fileDirectory;
            $this->gallery->setPath($fileDirectory);
            $results[$directory] = $this->gallery->getImages();

        }
        return $results;

    }
    
    public function getGalleries($where) {
        
        $galleries = $this->getFilePathsConditionally($this->galleriesPath, $where);
        return $galleries;
        
    }

    public function getAllGalleries() {

        $galleries = array();

        foreach(scandir($this->galleriesPath) as $gallery) {
            
            if($this->shouldBeIgnored($gallery)){
                continue;
            }
            
            $this->gallery->setPath($this->galleriesPath . $gallery);
            $images = $this->gallery->getImages();
            
            $galleries[$gallery] = $images;

        }

        return $galleries;

    }
    
    public function getGallerycovers($where) {
        
        $galleryCovers = $this->getFilePathsConditionally($this->galleriesPath, $where, '/gallerycover');
        return $galleryCovers;
        
    }
    
    public function getAllGallerycovers() {
        
        $galleryCovers = array();
        
        foreach(scandir($this->galleriesPath) as $gallery) {

            if($this->shouldBeIgnored($gallery)) {
                continue;
            }
            
            $pathToGalleryCovers = $this->galleriesPath . $gallery . '/gallerycover';
            $galleryCovers[$gallery] = $this->readDirectoryContents($pathToGalleryCovers);
            
        }
        
        return $galleryCovers;
        
    }

    private function writeGalleryMetaData($galleryPath, $galleryData) {
        
        $metaDataPath = $galleryPath . 'metadata.json';
        $jsonData = json_encode(galleryData);

        $success = file_put_contents($metaDataPath, $jsonData);

        if($success === FALSE) {
            return false;
        } else {
            return true;
        }

    }

    /*
     * This has to actually do something
     */

    private function validatePath($path) {

        return true;

    }

    private function createGallery($galleryPath, $galleryMetaData) {

        if($this->validatePath($galleryPath)) {

            $thumbnailPath = $galleryPath . 'thumbnails';
            mkdir($galleryPath);
            mkdir($thumbnailPath);

            $this->writeGalleryMetaData($galleryPath, $galleryMetaData);

        }
        
    }

    /**
     *
     * Method for adding a new image and creating a thumbnail to go with it.
     * Currently, only images that belong to the same gallery can be uploaded simultaneously.
     *
     * @param mixed[] $filesAndGalleryName Array containing an array with the paths to the images
     * being uploaded and their names. Optionally, if the images are part of a gallery, the field
     * 'galleryname' can be set with a string containing the name of the gallery.
     * 
     * @return $success Whether the image move was successful or not.
     *
     */

    public function insert($filesAndGalleryName) {

        $galleryName = isset($filesAndGalleryName['galleryname']) ? $filesAndGalleryName['galleryname'] . '/' : '';

        $success = false;
        foreach($filesAndGalleryName['files'] as $file) {

            if(empty($galleryName)) {
                //Move to images/
            } else {

                $galleryPath = $this->galleriesPath . $galleryName;

                if(!file_exists($galleryPath)) {
                    $galleryMetaData = $filesAndGalleryName;
                    unset($galleryMetaData['files']);

                    $this->createGallery($galleryPath, $galleryMetaData);

                }

                $filename = $galleryPath . basename($file['name']);
                
                $success = move_uploaded_file($file['tmp_name'], $filename);
                $this->gallery->createThumbnail($filename, $galleryPath . 'thumbnails/', 256);

            }

        }
        
        return $success;
        
    }

    /**
     *
     * Method for updating fields in the
     * database table image.
     *
     * @param string $primaryKey A string providing the primary key
     * column/value pairs that identify the row to be updated in the database.
     *
     * @param mixed[] $fields An array of sub-arrays
     * where each sub-array represents a database column. Sub-array[0] contains
     * a database column name, sub-array[1] contains an operator (should always be '=') and
     * sub-array[3] contains the new column value.
     *
     */

    public function update($primaryKey, $fields) {
        return $this->getDB()->update('image', $primaryKey, $fields);
    }

    /**
     *
     * Method for deleting images.
     * Currently, only a single image can be deleted at a time. This is a
     * safety measure to ensure that a whole group of images are not deleted
     * mistakenly.
     *
     * @param string[] $image An associative array specifying
     * different versions of the image and where they are located, like so:
     * 'full' => 'path/to/full',
     * 'thumb' => 'path/to/thumbnail'
     *
     */

    public function delete($image) {

        /*
         * The reason a for loop is used here is that
         * images both come in a full version and a thumbnail version.
         * I didn't want to hard code the names of these, or limit
         * different images file sizes to these two, so a for loop seemed reasonable.
         */
        foreach($image as $imageVariant) {
            
            unlink($imageVariant);
            
        }  
        
    }
}
