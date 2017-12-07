var arr=[
	{
		id: 1,
		text: '1',
		content: 'abc',
		parentId: 3
	},
	{
		id: 1,
		text: '1',
		content: 'abc',
		parentId: 3
	},
	{
		id: 2,
		text: '1',
		content: 'abc'
	},
	{
		id: 1,
		text: '2',
		content: 'abc',
		parentId: 3
	},
	{
		id: 1,
		text: '1',
		content: 'abcd',
		parentId: 3
	},
	{
		id: 1,
		text: '2',
		content: 'abc',
		parentId: 3
	},
];
var obj={};
console.log(arr);
function duplicateRemoval(num) {
	obj=arr[num];
	arr.forEach(function (value,index) {
		if (index!=num) {
			var attLen=0;
			for (attribute in value) {
				if (obj[attribute]&&obj[attribute]==value[attribute]) {
					// console.log(index);
					attLen++;
				}
			}
			// console.log(attLen);
			if (attLen==Object.keys(value).length) {
				console.log(1);
				arr.splice(index);					
			}			
		}	
	})
	num++;
	if (num>=arr.length) {
		console.log(arr,arr.length);
		return arr;
	} else{
		duplicateRemoval(num);
	}
}
duplicateRemoval(0);

