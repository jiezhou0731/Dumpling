<?php
class UserAuthorizeFilter extends CFilter
{
    protected function preFilter($filterChain)
    {
        if (!isset(Yii::app()->session['user_id'])){
            redirectTo(Yii::app()->request->baseUrl."/index.php?r=me/login&&alert=1");
            return false;
        }
        return true;
    }

    protected function postFilter($filterChain)
    {
    // logic being applied after the action is executed
    }
}
?>