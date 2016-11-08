<?php

require_once('core/init.php');

class GalleryTest extends \PHPUnit_Framework_TestCase {

    private $galleryPath = '../images/galleries/Folk at Heart - 15';

    public function testGetImagesReturnsPathsWithoutLeadingDots() {

        $gallery = new Gallery($this->galleryPath, null);

        $pathsWithLeadingDots = false;
        foreach ($gallery->getImages() as $pathsArray) {

            foreach ($pathsArray as $imagePath) {

                if(strlen($imagePath) > 2 && $imagePath[0] == '.' && $imagePath[1] == '.' && $imagePath[2] == '/') {
                    $pathsWithLeadingDots = true;
                    break 2;
                }
                
            }

        }

        $this->assertFalse($pathsWithLeadingDots);
        
    }

    public function testSetGalleryCoverWorksWithPathWithoutLeadingDots() {

        $gallery = new Gallery($this->galleryPath, null);

        $imageName = 'FaH 1.jpg';
        $newGalleryCover = $this->galleryPath . '/' . $imageName;
        $gallery->setGalleryCover($newGalleryCover);

        $prunedGalleryPath = substr($this->galleryPath, 3);
        $this->assertEquals($prunedGalleryPath . '/galleryCover/' . $imageName, $gallery->getGalleryCover());
            
    }

}
