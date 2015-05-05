<?php

/**
 * UserIdentity represents the data needed to identity a user.
 * It contains the authentication method that checks if the provided
 * data can identity the user.
 */
class AdminIdentity extends CUserIdentity
{
	private $_id;
    public function authenticate()
    {
        $record=Admin::model()->findByAttributes(array('admin_email'=>$this->username));
        if($record===null){
            $this->errorCode=self::ERROR_USERNAME_INVALID;
        }
        else if($record->admin_password!=$this->password){
            $this->errorCode=self::ERROR_PASSWORD_INVALID;
        }
        else
        {
            $this->_id=$record->admin_id;
            $this->setState('admin_id', $record->admin_id);
            $this->errorCode=self::ERROR_NONE;
        }
        return !$this->errorCode;
    }
 
    public function getId()
    {
        return $this->_id;
    }
}