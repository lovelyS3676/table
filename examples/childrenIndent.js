webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* eslint-disable no-console,func-names,react/no-multi-comp */
	'use strict';
	
	var React = __webpack_require__(2);
	var ReactDOM = __webpack_require__(159);
	var Table = __webpack_require__(160);
	__webpack_require__(165);
	
	var columns = [{
	  title: '姓名',
	  dataIndex: 'name',
	  key: 'name',
	  width: 400
	}, {
	  title: '年龄',
	  dataIndex: 'age',
	  key: 'age',
	  width: 100
	}, {
	  title: '住址',
	  dataIndex: 'address',
	  key: 'address',
	  width: 200
	}, {
	  title: '操作',
	  dataIndex: 'operation',
	  key: 'x',
	  width: 150
	}];
	
	var data = [{
	  key: 1,
	  name: 'a',
	  age: 32,
	  address: '我是a',
	  children: [{
	    key: 11,
	    name: 'aa',
	    age: 33,
	    address: '我是aa'
	  }, {
	    key: 12,
	    name: 'ab',
	    age: 33,
	    address: '我是ab',
	    children: [{
	      key: 121,
	      name: 'aba',
	      age: 33,
	      address: '我是aba'
	    }]
	  }, {
	    key: 13,
	    name: 'ac',
	    age: 33,
	    address: '我是ac',
	    children: [{
	      key: 131,
	      name: 'aca',
	      age: 33,
	      address: '我是aca',
	      children: [{
	        key: 1311,
	        name: 'acaa',
	        age: 33,
	        address: '我是acaa'
	      }, {
	        key: 1312,
	        name: 'acab',
	        age: 33,
	        address: '我是acab'
	      }]
	    }]
	  }]
	}, {
	  key: 2,
	  name: 'b',
	  age: 32,
	  address: '我是b'
	}];
	
	ReactDOM.render(React.createElement(Table, { defaultExpandAllRows: true, columns: columns, data: data, indentSize: 30 }), document.getElementById('__react-content'));

/***/ }
]);
//# sourceMappingURL=childrenIndent.js.map