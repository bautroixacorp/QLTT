<?php
require_once(__DIR__ ."../../../../core/abstract/NodeController.php");
require_once(__DIR__ ."/../../StudentModel.php");


    class FollowsController extends NodeController {
        protected function _POST() {
            
        }
        protected function _GET() {
            // xử lí input
            if (isset($_GET['fields'])){
                $fieldsArr = explode(",",$_GET['fields']);
            }
            $std_id = intval($this->nodeIds[0]);

            // get từ CSDL
            $model = new StudentModel();
            $data = $model->getFollows($fieldsArr, $std_id);

            // res về client
            $this->response('200', $data);
        }
        protected function _PUT() {
            
        }
        protected function _DELETE() {
            
        }
    }

?>