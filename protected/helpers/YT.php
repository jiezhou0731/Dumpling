<?php

/**
 * YT class file
 * 
 * YT (Yii Theme) is a helper for Yii framework template engine 
 * to give it inheritance and template nesting ability with pure 
 * php and no affection on performance. YT is based on PTI, 
 * a tool created by Adam Shaw, released under the MIT License.
 * 
 * You may check ext page on yii () 
 * or PTI original guide (http://phpti.com/) 
 * for more info.
 * 
 * @author Adam Shaw <arshaw@arshaw.com>, Moslem Hamzehnejadi <me.moslem@gmail.com>
 * @copyright  Copyright (c) 2010 Adam Shaw (http://arshaw.com)
 * 
 * */

class YT {
    
     protected static $_base = null;
     protected static $_stack = null;
     protected static $_hash = null;
     protected static $_level = null;
     protected static $_after = null;
     protected static $_end = null; 
     protected static $_vars = array();
     
     
    static public function emptyblock($name) {
            $trace = self::_callingTrace();
            self::_init($trace);
            self::_insertBlock(
                    self::_newBlock($name, null, $trace)
            );
    }


    static public function startblock($name, $filters=null) {
            $trace = self::_callingTrace();
            self::_init($trace);
            $stack =& self::$_stack;
            $stack[] = self::_newBlock($name, $filters, $trace);
    }


    static public function endblock($name=null) {
            $trace = self::_callingTrace();
            self::_init($trace);
            $stack =& self::$_stack;
            if ($stack) {
                    $block = array_pop($stack);
                    if ($name && $name != $block['name']) {
                            self::_warning("startblock('{$block['name']}') does not match endblock('$name')", $trace);
                    }
                    self::_insertBlock($block);
            }else{
                    self::_warning(
                            $name ? "orphan endblock('$name')" : "orphan endblock()",
                            $trace
                    );
            }
    }
    
    
    static public function simpleblock($name, $value=null, $filters=null) {
            self::startblock($name, $filters);
            echo $value;
            self::endblock($name);
    }


    static public function superblock() {
            if (self::$_stack) {
                    echo self::getsuperblock();
            }else{
                    self::_warning(
                            "superblock() call must be within a block",
                            self::_callingTrace()
                    );
            }
    }


    static public function getsuperblock() {
            $stack =& self::$_stack;
            if ($stack) {
                    $hash =& self::$_hash;
                    $block = end($stack);
                    if (isset($hash[$block['name']])) {
                            return implode(
                                    self::_compile(
                                            $hash[$block['name']]['block'],
                                            ob_get_contents()
                                    )
                            );
                    }
            }else{
                    self::_warning(
                            "getsuperblock() call must be within a block",
                            self::_callingTrace()
                    );
            }
            return '';
    }


    static public function flushblocks() {
            $base =& self::$_base;
            if ($base) {
                    $stack =& self::$_stack;
                    $level =& self::$_level;
                    while ($block = array_pop($stack)) {
                            self::_warning(
                                    "missing endblock() for startblock('{$block['name']}')",
                                    self::_callingTrace(),
                                    $block['trace']
                            );
                    }
                    while (ob_get_level() > $level) {
                            ob_end_flush(); // will eventually trigger bufferCallback
                    }
                    $base = null;
                    $stack = null;
            }
    }


    static public function blockbase() {
            self::_init(self::_callingTrace());
    }
    
    
    static public function vars($key, $value = false) {
            if($value) {
                    self::$_vars[$key] = $value;
                    return true;
            }
            elseif(isset(self::$_vars[$key])) {
                    return self::$_vars[$key];
            }
            else {
                    return false;
            }
    }
    
    
    static public function viewpath($alias, $absolute = false) {
            if($absolute) return Yii::getPathOfAlias ($alias);
            // modify by @andrew
            return Yii::getPathOfAlias($alias) . '.php';
            $parts = explode('.', $alias);
            
            if(strpos($alias, '.') === false) {
                     return $alias . '.php';
            }

            if(isset(Yii::app()->theme->name)) {
                    $pre = Yii::app()->theme->name;
                    $pre = 'webroot.themes.' . $pre . '.views.' . $alias;
                    if(Yii::getPathOfAlias($pre)) return Yii::getPathOfAlias ($pre) . '.php';
            }
            if(count($parts) == 3) {
                    $pre = 'application.' . $parts[0] . '.views.' . $parts[1] . '.' .$parts[2];
            }
            else {
                    $pre = 'application.views.'. $alias;
            }
            
            return Yii::getPathOfAlias($pre) . '.php';
    }


    static private function _init($trace) {
            $base =& self::$_base;
            if ($base && !self::_inBaseOrChild($trace)) {
                    self::flushblocks(); // will set $base to null
            }
            if (!$base) {
                    $base = array(
                            'trace' => $trace,
                            'filters' => null, // purely for compile
                            'children' => array(),
                            'start' => 0, // purely for compile
                            'end' => null
                    );
                    self::$_level = ob_get_level();
                    self::$_stack = array();
                    self::$_hash = array();
                    self::$_end = null;
                    self::$_after = '';
                    ob_start(array('YT','_bufferCallback'));
            }
    }
    

    static private function _newBlock($name, $filters, $trace) {
            $base =& self::$_base;
            $stack =& self::$_stack;
            while ($block = end($stack)) {
                    if (self::_isSameFile($block['trace'], $trace)) {
                            break;
                    }else{
                            array_pop($stack);
                            self::_insertBlock($block);
                            self::_warning(
                                    "missing endblock() for startblock('{$block['name']}')",
                                    self::_callingTrace(),
                                    $block['trace']
                            );
                    }
            }
            if ($base['end'] === null && !self::_inBase($trace)) {
                    $base['end'] = ob_get_length();
            }
            if ($filters) {
                    if (is_string($filters)) {
                            $filters = preg_split('/\s*[,|]\s*/', trim($filters));
                    }
                    else if (!is_array($filters)) {
                            $filters = array($filters);
                    }
                    foreach ($filters as $i => $f) {
                            if ($f && !is_callable($f)) {
                                    self::_warning(
                                            is_array($f) ?
                                                    "filter " . implode('::', $f) . " is not defined":
                                                    "filter '$f' is not defined", // TODO: better messaging for methods
                                            $trace
                                    );
                                    $filters[$i] = null;
                            }
                    }
            }
            return array(
                    'name' => $name,
                    'trace' => $trace,
                    'filters' => $filters,
                    'children' => array(),
                    'start' => ob_get_length()
            );
    }


    static private function _insertBlock($block) { // at this point, $block is done being modified
            $base =& self::$_base;
            $stack =& self::$_stack;
            $hash =& self::$_hash;
            $end =& self::$_end;
            $block['end'] = $end = ob_get_length();
            $name = $block['name'];
            if ($stack || self::_inBase($block['trace'])) {
                    $block_anchor = array(
                            'start' => $block['start'],
                            'end' => $end,
                            'block' => $block
                    );
                    if ($stack) {
                            // nested block
                            $stack[count($stack)-1]['children'][] =& $block_anchor;
                    }else{
                            // top-level block in base
                            $base['children'][] =& $block_anchor;
                    }
                    $hash[$name] =& $block_anchor; // same reference as children array
            }
            else if (isset($hash[$name])) {
                    if (self::_isSameFile($hash[$name]['block']['trace'], $block['trace'])) {
                            self::_warning(
                                    "cannot define another block called '$name'",
                                    self::_callingTrace(),
                                    $block['trace']
                            );
                    }else{
                            // top-level block in a child template; override the base's block
                            $hash[$name]['block'] = $block;
                    }
            }
    }


    static public function _bufferCallback($buffer) {
            $base =& self::$_base;
            $stack =& self::$_stack;
            $end =& self::$_end;
            $after =& self::$_after;
            if ($base) {
                    while ($block = array_pop($stack)) {
                            self::_insertBlock($block);
                            self::_warning(
                                    "missing endblock() for startblock('{$block['name']}')",
                                    self::_callingTrace(),
                                    $block['trace']
                            );
                    }
                    if ($base['end'] === null) {
                            $base['end'] = strlen($buffer);
                            $end = null; // todo: more explanation
                            // means there were no blocks other than the base's
                    }
                    $parts = self::_compile($base, $buffer);
                    // remove trailing whitespace from end
                    $i = count($parts) - 1;
                    $parts[$i] = rtrim($parts[$i]);
                    // if there are child template blocks, preserve output after last one
                    if ($end !== null) {
                            $parts[] = substr($buffer, $end);
                    }
                    // for error messages
                    $parts[] = $after;
                    return implode($parts);
            }else{
                    return '';
            }
    }


    static private function _compile($block, $buffer) {
            $parts = array();
            $previ = $block['start'];
            foreach ($block['children'] as $child_anchor) {
                    $parts[] = substr($buffer, $previ, $child_anchor['start'] - $previ);
                    $parts = array_merge(
                            $parts,
                            self::_compile($child_anchor['block'], $buffer)
                    );
                    $previ = $child_anchor['end'];
            }
            if ($previ != $block['end']) {
                    // could be a big buffer, so only do substr if necessary
                    $parts[] = substr($buffer, $previ, $block['end'] - $previ);
            }
            if ($block['filters']) {
                    $s = implode($parts);
                    foreach ($block['filters'] as $filter) {
                            if ($filter) {
                                    $s = call_user_func($filter, $s);
                            }
                    }
                    return array($s);
            }
            return $parts;
    }


    static private function _warning($message, $trace, $warning_trace=null) {
            if (error_reporting() & E_USER_WARNING) {
                    if (defined('STDIN')) {
                            // from command line
                            $format = "\nWarning: %s in %s on line %d\n";
                    }else{
                            // from browser
                            $format = "<br />\n<b>Warning</b>:  %s in <b>%s</b> on line <b>%d</b><br />\n";
                    }
                    if (!$warning_trace) {
                            $warning_trace = $trace;
                    }
                    $s = sprintf($format, $message, $warning_trace[0]['file'], $warning_trace[0]['line']);
                    if (!self::$_base || self::_inBase($trace)) {
                            echo $s;
                    }else{
                            self::$_after .= $s;
                    }
            }
    }


    /* backtrace utilities
    ------------------------------------------------------------------------*/


    static private function _callingTrace() {
            $trace = debug_backtrace();
            foreach ($trace as $i => $location) {
                    if ($location['file'] !== __FILE__) {
                            return array_slice($trace, $i);
                    }
            }
    }


    static private function _inBase($trace) {
            return self::_isSameFile($trace, self::$_base['trace']);
    }


    static private function _inBaseOrChild($trace) {
            $base_trace = self::$_base['trace'];
            return
                    $trace && $base_trace &&
                    self::_isSubtrace(array_slice($trace, 1), $base_trace) &&
                    $trace[0]['file'] === $base_trace[count($base_trace)-count($trace)]['file'];
    }


    static private function _isSameFile($trace1, $trace2) {
            return
                    $trace1 && $trace2 &&
                    $trace1[0]['file'] === $trace2[0]['file'] &&
                    array_slice($trace1, 1) === array_slice($trace2, 1);
    }


    static private function _isSubtrace($trace1, $trace2) { // is trace1 a subtrace of trace2
            $len1 = count($trace1);
            $len2 = count($trace2);
            if ($len1 > $len2) {
                    return false;
            }
            for ($i=0; $i<$len1; $i++) {
                    if ($trace1[$len1-1-$i] !== $trace2[$len2-1-$i]) {
                            return false;
                    }
            }
            return true;
    }
    
    
    //--------- autoFlush on destruct [sim] ---------//
    
    
    public static function destruct() {
        
    }
    
    
    public function __destruct() {
            YT::destruct();
    }
}