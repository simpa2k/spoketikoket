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
            $albumPath;

    public function __construct() {

        parent::__construct();

        $this->gallery = new Gallery();
        $this->gallery->setPath("../images/");
        $this->albumPath = "../images/albums/";

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
    
    public function getAlbums($where) {
        
        return "getting albums";
        
    }

    private function isHiddenDirectory($directory) {
        
        if($directory == "." || $directory == "..") {
            return true;
        } else {
            return false;
        }
        
    }
    
    public function getAllAlbums() {

        $albums = array();

        foreach(scandir($this->albumPath) as $album) {
            
            if($this->isHiddenDirectory($album)){
                continue;
            }
            
            $this->gallery->setPath($this->albumPath . $album);
            $images = $this->gallery->getImages();
            
            $albums[$album] = $images;

        }

        return $albums;

    }
    
    public function getAlbumcovers($where) {
        
        return "getting album covers";
        
    }
    
    public function getAllAlbumcovers() {
        
        $albumCovers = array();
        
        foreach(scandir($this->albumPath) as $album) {

            if($this->isHiddenDirectory($album)) {
                continue;
            }
            
            $albumCovers[$album] = array();
            $pathToAlbumCovers = $this->albumPath . $album . '/albumcover';
            
            foreach(scandir($pathToAlbumCovers) as $albumCover) {
                
                if($this->isHiddenDirectory($albumCover)) {
                    continue;
                }
                
                $albumCovers[$album][] = $pathToAlbumCovers . '/' . $albumCover;
                
            }
            
        }
        
        return $albumCovers;
        
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
