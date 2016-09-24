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
            $galleryPath;

    public function __construct() {

        parent::__construct();

        $this->gallery = new Gallery();
        $this->gallery->setPath("../images/");
        $this->galleryPath = "../images/galleries/";

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
        
        $galleries = $this->getFilePathsConditionally($this->galleryPath, $where);
        return $galleries;
        
    }

    
    public function getAllGalleries() {

        $galleries = array();

        foreach(scandir($this->galleryPath) as $gallery) {
            
            if($this->shouldBeIgnored($gallery)){
                continue;
            }
            
            $this->gallery->setPath($this->galleryPath . $gallery);
            $images = $this->gallery->getImages();
            
            $galleries[$gallery] = $images;

        }

        return $galleries;

    }
    
    public function getGallerycovers($where) {
        
        $galleryCovers = $this->getFilePathsConditionally($this->galleryPath, $where, '/gallerycover');
        return $galleryCovers;
        
    }
    
    public function getAllGallerycovers() {
        
        $galleryCovers = array();
        
        foreach(scandir($this->galleryPath) as $gallery) {

            if($this->shouldBeIgnored($gallery)) {
                continue;
            }
            
            $pathToGalleryCovers = $this->galleryPath . $gallery . '/gallerycover';
            $galleryCovers[$gallery] = $this->readDirectoryContents($pathToGalleryCovers);
            
        }
        
        return $galleryCovers;
        
    }

    /**
     *
     * Method for inserting data into image.
     *
     * @param mixed[] $fields Array containing the values to be inserted.
     *
     */

    public function insert($fields) {
        return $this->getDB()->insert('image', $fields);
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
     * Method for deleting database rows.
     *
     * @param mixed[] $where An array of sub-arrays specifying
     * the database row to be deleted, where sub-array[0] contains a database
     * column name, sub-array[1] contains an operator and
     * sub-array[3] contains the value to be matched.
     *
     */

    public function delete($where) {
        return $this->getDB()->delete('image', $where);
    }
}
