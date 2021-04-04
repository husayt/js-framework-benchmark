'use strict';

let startTime = {};
let tot = []

const start = function(name) {
//	document.querySelector('#time').blur()

	tot.push(new Date().getTime())
    if (!startTime[name]) {
        startTime[name] = [ new Date().getTime()]    
    }    
};
const stop = function(name) {
    if (startTime[name]) {
        startTime[name].push(new Date().getTime())
        console.log('DooHTML', name, 'took:', startTime[name][1] - startTime[name][0]);
        // document.querySelector('#time').value += `${name} took: ${startTime[name][1] - startTime[name][0]}\n`
		if (tot.length === 2) {
    		console.log('DooHTML Tot:', startTime[name][1] - tot[0])
	//document.querySelector('#time').scrollIntoView()
			// document.querySelector('#time').value =`Tot: ${startTime[name][1] - tot[0]}\n`
			// document.querySelector('#time').value +=`Len ${Main[0].tbody.childNodes.length}\n`
    		// document.querySelector('#time').focus()

			tot = []
    	}
    	startTime[name] = undefined
    }
};

const _random = ((max) => {
    return Math.round(Math.random()*1000)%max;
})

const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

const lenA = adjectives.length
const lenB = colours.length
const lenC = nouns.length

const rowTemplate = document.createElement("tr");
rowTemplate.innerHTML = "<td class='col-md-1'></td><td class='col-md-4'><a class='lbl'></a></td><td class='col-md-1'><a class='remove'><span class='remove glyphicon glyphicon-remove' aria-hidden='true'></span></a></td><td class='col-md-6'></td>";


Doo.define(
  	class Main extends Doo {
		constructor() {
			super(10000)
			this.scrollTarget = '.table'
			this.defaultDataSet = 'rows'
			this.ID = 1
			this.data = {
				[this.defaultDataSet]: []
			}
			this.add = this.add.bind(this)
			this.run = this.run.bind(this)
			this.runLots = this.runLots.bind(this)
			this.update = this.update.bind(this)
			this.clear = this.clear.bind(this)
			this.swaprows = this.swapRows.bind(this)
			this.addEventListeners()
			this.selectedRow = undefined
			document.querySelector(".ver").innerHTML += ` ${Doo.version} (keyed)`
			document.title += ` ${Doo.version} (keyed)`
			//this.time = document.querySelector('#time')
			this.stop = stop
			this.start = start
		}

		async dooAfterRender() {
			this.tbody = this.shadow.querySelector('#tbody')
			this.shadow.querySelector(this.scrollTarget).addEventListener('click', e => {
				e.preventDefault();
				if (e.target.parentElement.matches('.remove')) {
					this.delete(e.target.parentElement);
				} else if (e.target.tagName === 'A') {
					this.select(e.target);
				}
			});
		}
	
		getParentRow(elem) {
        	while (elem) {
        		if (elem.tagName === "TR") {return elem}
        		elem = elem.parentNode;
        	}
        	return undefined;
        }

		buildData(count = 1000) {
			const data = [];
			for (let i = 0; i < count; i++) {
				data.push({id: this.ID++,label: adjectives[_random(lenA)] + " " + colours[_random(lenB)] + " " + nouns[_random(lenC)]})
			}
			return data	
		}

		delete(elem) {
			let row = this.getParentRow(elem)
			if (row) {
				this.tbody.removeChild(row)
				this.data.rows[row.getAttribute('key')] = undefined
			}
		}  

		run(e) {
			start('buildData')
			this.data.rows = this.buildData()
			stop('buildData')
			start('run')
			this.tbody.textContent = ""
			
			this.render()
			e.target.blur()
			stop('run')
		}

		add(e) {
			start('append')
			let len = this.data.rows.length
			this.data.rows = this.data.rows.concat(this.buildData())
			stop('append')
			start('runAppend')
			this.renderSlice(this.data.rows, len)
			e.target.blur()
			stop('runAppend')
		}    

		async renderSlice(dataSet=this.data[this.defaultDataSet], pointer=0, stop=null,e) {
			let tableRef = this.tbody.parentElement

			let rowList = []
			let rowList2 = []
	/*
			const observer = new MutationObserver(	
				(mutationsList, observer) => {	
					debugger
						if (mutationsList[0].type === 'attributes' ) {
							console.log('coolio')
							let test = document.createElement('td')
							test.innerHTML = 'coolio' + this.k
							
							mutationsList[0].target.parentNode.appendChild(test)
						}	
				}			
			)		
*/


			for (let i=0;i<10000;i++) {
				let newRow = tableRef.insertRow(-1)
				rowList.push(newRow)
				rowList2.push(this.renderNode(this.place[0], this.data.rows, i  , 1 ))
	
			}
			for (let i=0;i<10000;i++) {
				//rowList[i].innerHTML = tb.childNodes[i].innerHTML
				rowList[i].innerHTML = rowList2[i]

			}
			rowList = undefined
			rowList2 = undefined
			return
			/*
			let promise = new Promise((resolve) => {
				for (let i=100;i<10000;i++) {
					rowList[i].innerHTML = rowList2[i]

				}
				setTimeout(()=>resolve(), 5000)
			})	
			await promise
		*/
			// for (let i=0;i<100;i++) {
			// 	//				this.tbody.replaceChild(frag[i], rowList[i])
			// 	//				rowList[i].setAttribute('key',i)
			// 					rowList[i].innerHTML = rowList2[i]
			// 	//				this.tbody.replaceChild(frag[i], rowList[i])
				
			// 				}
				

	//		return
		}	

		appendData(dataSet, start) {
			if (start) {
				let len = this.PAGE_SIZE
				let d = document.createDocumentFragment();
				for (let i=0;i<len;i++) {
					let tb = document.createElement(this.place[0].tagName)
					//let tr = document.createElement('tr')
					tb.innerHTML = this.renderNode(this.place[0], this.data.rows, i, len)
					d.appendChild(tb.firstElementChild)
				}
				this.place[0].appendChild(d)	
			} else {
				this.renderAll()
			}	
		}

		runLots(e) {
			start('buildLots')
			this.data.rows = this.buildData(10000);
			stop('buildLots')
			start('runLots')
			this.tbody.textContent = ""
			this.renderSlice(this.data.rows, 0, 1000,e)
			e.target.blur()
			stop('runLots')
		}

		update() {
			let tr = this.tbody.querySelectorAll('tr')
			for (let i=0, len = this.data.rows.length;i<len;i+=10) {
				this.data.rows[i].label += ' !!!';
				tr[i].childNodes[1].childNodes[0].innerHTML = this.data.rows[i].label
			}
		}

		select(elem) {
			if (this.selectedRow) {
				this.selectedRow.classList.remove('danger')
				this.selectedRow = undefined
				//	return  should toggle IMO
			}
			let row = this.getParentRow(elem)
			if (row) {
				row.classList.toggle('danger')
				this.selectedRow = row
			}    
		}

		clear() {
			this.data.rows = []
			this.clearAll()
		}

		swapRows() {
			if (this.data.rows.length>10) {
				let tr = this.tbody.querySelectorAll('tr')
				let swapNodeIdx =  Math.min(tr.length - 2, 998)
				let node1 = tr[1].cloneNode(true)
				let node2 = tr[swapNodeIdx].cloneNode(true)
				let tmp = this.data.rows[1]
				this.data.rows[1] = this.data.rows[swapNodeIdx];
				this.data.rows[swapNodeIdx] = tmp;
				this.tbody.replaceChild(node2, tr[1])
				this.tbody.replaceChild(node1, tr[swapNodeIdx])
			}
		}

		addEventListeners() {
			document.getElementById("main").addEventListener('click', e => {
				e.preventDefault();
				if (e.target.matches('#runlots')) {
					this.runLots(e);
				} else if (e.target.matches('#run')) {
					this.run(e);
				} else if (e.target.matches('#add')) {
					this.add(e);
				} else if (e.target.matches('#update')) {
					this.update();
				} else if (e.target.matches('#clear')) {
					this.clear();
				} else if (e.target.matches('#swaprows')) {
					this.swapRows();
				}
			})    
    	}   
	}
)
