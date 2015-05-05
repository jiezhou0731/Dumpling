<?php

/**
 * This is the model class for table "event".
 *
 * The followings are the available columns in table 'event':
 * @property integer $event_id
 * @property string $event_title
 * @property string $event_detail
 * @property integer $event_time
 * @property string $event_ip
 * @property string $event_extra_1
 * @property string $event_extra_2
 */
class Event extends CActiveRecord
{
	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'event';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('event_time', 'numerical', 'integerOnly'=>true),
			array('event_title, event_ip', 'length', 'max'=>200),
			array('event_detail', 'length', 'max'=>500),
			array('event_extra_1, event_extra_2', 'safe'),
			// The following rule is used by search().
			// @todo Please remove those attributes that should not be searched.
			array('event_id, event_title, event_detail, event_time, event_ip, event_extra_1, event_extra_2', 'safe', 'on'=>'search'),
		);
	}

	/**
	 * @return array relational rules.
	 */
	public function relations()
	{
		// NOTE: you may need to adjust the relation name and the related
		// class name for the relations automatically generated below.
		return array(
		);
	}

	/**
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels()
	{
		return array(
			'event_id' => 'Event',
			'event_title' => 'Event Title',
			'event_detail' => 'Event Detail',
			'event_time' => 'Event Time',
			'event_ip' => 'Event Ip',
			'event_extra_1' => 'Event Extra 1',
			'event_extra_2' => 'Event Extra 2',
		);
	}

	/**
	 * Retrieves a list of models based on the current search/filter conditions.
	 *
	 * Typical usecase:
	 * - Initialize the model fields with values from filter form.
	 * - Execute this method to get CActiveDataProvider instance which will filter
	 * models according to data in model fields.
	 * - Pass data provider to CGridView, CListView or any similar widget.
	 *
	 * @return CActiveDataProvider the data provider that can return the models
	 * based on the search/filter conditions.
	 */
	public function search()
	{
		// @todo Please modify the following code to remove attributes that should not be searched.

		$criteria=new CDbCriteria;

		$criteria->compare('event_id',$this->event_id);
		$criteria->compare('event_title',$this->event_title,true);
		$criteria->compare('event_detail',$this->event_detail,true);
		$criteria->compare('event_time',$this->event_time);
		$criteria->compare('event_ip',$this->event_ip,true);
		$criteria->compare('event_extra_1',$this->event_extra_1,true);
		$criteria->compare('event_extra_2',$this->event_extra_2,true);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}

	/**
	 * Returns the static model of the specified AR class.
	 * Please note that you should have this exact method in all your CActiveRecord descendants!
	 * @param string $className active record class name.
	 * @return Event the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}
}
