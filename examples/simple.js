webpackJsonp([5],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(65);


/***/ },

/***/ 65:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(2);
	var Table = __webpack_require__(3);
	__webpack_require__(7);
	
	var columns = [{ title: '表头1', dataIndex: 'a', key: 'a', width: 100 }, { id: '123', title: '表头2', dataIndex: 'b', key: 'b', width: 100 }, { title: '表头3', dataIndex: 'c', key: 'c', width: 200 }, {
	  title: '操作', dataIndex: '', key: 'd', render: function render() {
	    return React.createElement(
	      'a',
	      { href: "#" },
	      '操作'
	    );
	  }
	}];
	
	var data = [{ a: '123', key: '1' }, { a: 'cdd', b: 'edd', key: '2' }, { a: '1333', c: 'eee', d: 2, key: '3' }];
	
	var table = React.render(React.createElement(
	  'div',
	  null,
	  React.createElement(
	    'h2',
	    null,
	    'simple table'
	  ),
	  React.createElement(Table, { columns: columns,
	    data: data,
	    className: "table" })
	), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=simple.js.map