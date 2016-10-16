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

        $this->galleriesPath = "../images/galleries/";
        $this->galleries = $this->readGalleries();

    }

    private function readGalleries() {

        $galleries = array();
        $galleriesDir = opendir($this->galleriesPath);

        while(($galleryName = readdir($galleriesDir)) !== false) {

            $galleryPath = $this->galleriesPath . $galleryName;

            if(is_dir($galleryPath) && !($this->shouldBeIgnored($galleryName))) {
                $galleries[$galleryName] = new Gallery($galleryPath, null);
            }
            
        }

        return $galleries;

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
    
    /*
     * ToDo: This double loop is ridiculous. The queries really need to be using keys for this sort of thing.
     * Eg. instead of array([0] => 'galleryname', [1] => '=', [2] => 'Folk at Heart - 15')
     * they should look something like array('property' => 'galleryname', 'operator' => '=', 'value' => 'Folk at Heart - 15')
     * In addition to this, when nothing matches the query everything is returned. That isn't right.
     * Also, add support for other operators than '='.
     */

    private function compareMetaDataToQuery($metaData, $queryParameters) {

        foreach($queryParameters as $queryParameter) {

            foreach($metaData as $property => $value) {

                /* 
                 * $queryParameter[0] is the key, for example galleryname,
                 * while $queryParameter[2] is the value, for example 'Folk at Heart - 15'.
                 * As of now, $queryParameter[1], the operator, is assumed to be '=',
                 * this might need fixing though.
                 */
                if($property == $queryParameter[0] && $queryParameter[2] != $value) {

                    return false;
                }
                return true;
            }
        }
    }

    public function getGalleries($where) {
        
        $galleries = array();

        foreach($this->galleries as $galleryName => $gallery) {

            $metaData = $gallery->getMetaData();

            if($this->compareMetaDataToQuery($metaData, $where)) {
                $galleries[$gallery->getName()] = $gallery->getImages();
            }

        }

        return $galleries;
        
    }

    public function getAllGalleries() {

        $galleries = array();

        foreach ($this->galleries as $galleryName => $gallery) {
            $galleries[$galleryName] = $gallery->getImages();
        }

        return $galleries;

    }
    
    public function getGallerycovers($where) {
        
        //$galleryCovers = $this->getFilePathsConditionally($this->galleriesPath, $where, '/gallerycover');
        $galleryCovers = array();

        foreach($this->galleries as $galleryName => $gallery) {
            $galleryCovers[$galleryName] = $gallery->getGalleryCover();    
        }

        return $galleryCovers;
        
    }
    
    public function getAllGallerycovers() {
        
        $galleryCovers = array();

        foreach($this->galleries as $galleryName => $gallery) {
            $galleryCovers[$galleryName] = $gallery->getGalleryCover();    
        }
        
        /*foreach(scandir($this->galleriesPath) as $gallery) {

            if($this->shouldBeIgnored($gallery)) {
                continue;
            }
            
            $pathToGalleryCovers = $this->galleriesPath . $gallery . '/gallerycover';
            $galleryCovers[$gallery] = $this->readDirectoryContents($pathToGalleryCovers);
            
        }*/
        
        return $galleryCovers;
        
    }

    /**
     *
     * Method for adding a new image and creating a thumbnail to go with it.
     * ToDo: Currently, only images that belong to the same gallery can be uploaded simultaneously.
     *
     * @param mixed[] $filesAndGalleryName Array containing an array with the paths to the images
     * being uploaded and their names. Optionally, if the images are part of a gallery, the field
     * 'galleryname' can be set with a string containing the name of the gallery.
     * 
     * @return $success Whether the image move was successful or not.
     *
     */

    public function insert($filesAndGalleryName) {

        $galleryName = isset($filesAndGalleryName['galleryname']) ? $filesAndGalleryName['galleryname'] : '';

        $success = false;
        foreach($filesAndGalleryName['files'] as $file) {

            if(empty($galleryName)) {
                //Move to images/
            } else {

                $galleryPath = $this->galleriesPath . $galleryName;
                $gallery = $this->galleries[$galleryName];

                if($gallery == null) {

                    $galleryMetaData = $filesAndGalleryName;
                    unset($galleryMetaData['files']);

                    $gallery = new Gallery($galleryPath, $galleryMetaData, true);

                }

                $gallery->addImage($file['tmp_name'], basename($file['name']));

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
     * ToDo: Currently, only a single image can be deleted at a time. This adds 
     * a measure of safety in that a whole group of images can not be deleted
     * mistakenly at once, but might need reconsidering.
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
         * most images both come in a full version and a thumbnail version, while
         * the ones that are used as gallery covers have an additional path to
         * that version of the images specified.
         * I didn't want to hard code the names of these, or limit
         * different images file sizes to these two or three, so a for loop seemed reasonable.
         */

        foreach($image as $imageVariant) {
            
            unlink($imageVariant);
            
        }  
        
    }
}
