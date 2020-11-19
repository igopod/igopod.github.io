const input = document.getElementById("openXML")
let xmlDoc;
let xmlContent;

input.addEventListener("change", async e => {
  console.log(input.files);

  const reader = new FileReader();
  reader.readAsText(input.files[0], encoding=document.getElementById("select-encoding").value);
  reader.onload = () => {
    // console.log(reader.result);
    const parser = new DOMParser();
    xmlDoc = parser.parseFromString(reader.result, "text/xml");
    // Получение основного xml контента
    xmlContent = xmlDoc.firstChild.children;
    // delete table if another file opened before generate new one
    for (table of document.getElementsByClassName("content-table")) {
      table.remove();
    }
    genTable(xmlContent);
  };
});

// allow change value of encondig by mouse wheel
document.getElementById('select-encoding').addEventListener('wheel', function(e) {
  if (this.hasFocus) {
    return;
  }
  if (e.deltaY < 0) {
    this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
  }
  if (e.deltaY > 0) {
    this.selectedIndex = Math.min(this.selectedIndex + 1, this.length-1);
  }
});

function createHeaderNames(xmlArr) {
  s = new Set();
  for (let i of xmlArr) {
    for (let j of i.keys()) {
      s.add(j);
    };
  };
  return s;
}

function getAttributes(elem) {
  let attrs = [];
  for (let i=0; i<elem.attributes.length; i++) {
    attrs.push([elem.attributes[i].nodeName, elem.attributes[i].nodeValue]);
  };
  return attrs;
};

function getElementValue(elem) {
  try {
    return [elem.localName, elem.firstChild.nodeValue.trim()];
  } catch (err) {
    if (err instanceof TypeError) {
      console.log(err);
    } else console.log(err);
  };
};

// Функция tire 1 формирует Map() из верхнего уровня данных структуры xml,
// после которой будет выполняться уже существующая функция tier 2
// для сбора остальных данных
function unwrapXMLT1(xmlData) {
  let xmlArr = new Array(xmlData.length);
  let xmlDataLength = xmlData.length
  // for (let i=0; i<xmlDataLength; i++) {
  //   xmlArr[i] = Array(0);
  // };

  let rowMap;
  let elemVal;
  let attrVal;

  for (let i=0; i<xmlDataLength; i++) {
    rowMap = new Map([["№", i+1]]);

    elemVal = getElementValue(xmlData[i]);
    attrVal = getAttributes(xmlData[i]);

    if (elemVal) {
      rowMap.set(...renIfSame(rowMap, elemVal));
    };

    if (attrVal) {
      attrVal.forEach((item) => rowMap.set(...renIfSame(rowMap, item)));
    };

      xmlArr[i] = unwrapXMLT2(xmlData[i].children, rowMap);
    };
  return xmlArr;
}

function unwrapXMLT2(xmlData, unwrappedRow) {
  for (let i=0; i<xmlData.length; i++) {
    let elemVal = getElementValue(xmlData[i]);
    let attrVal = getAttributes(xmlData[i]);
    
    if (elemVal) {
      unwrappedRow.set(...renIfSame(unwrappedRow, elemVal));
    };
    
    if (attrVal) {
      attrVal.forEach((item) => unwrappedRow.set(...renIfSame(unwrappedRow, item)));
    };
    
    if (xmlData[i].childElementCount !== 0) {
      mapMerge(unwrappedRow, unwrapXML(xmlData[i].children, unwrappedRow));
    };
  };
  return unwrappedRow;
};

// marges two Maps into one and return result of this merge
function mapMerge(targetMap, mergeMap) {
  for (item of mergeMap) {
    targetMap.set(item[0], item[1]);
    console.log(`Merging ${item[0]}: ${item[1]} into ${targetMap}`);
  };
  return targetMap;
};

// rename key value, if key already exist by adding index value in the end of key
function renIfSame(map, arr) {
  let index = 0;
  let tmpKey = arr[0];

  while (map.has(tmpKey)) {
    index++;
    tmpKey = `${arr[0]}_${index}`;
  };
  return [tmpKey, arr[1]];
};

function genTable(xmlData) {
  let body = document.getElementsByTagName("body")[0];
  // creates a <table> element and a <tbody> element
  let tbl = document.createElement("table");
      tbl.className = "content-table"
  let tblHead = document.createElement("thead");
  let tblBody = document.createElement("tbody");
  let hRow = document.createElement("tr");


  let xmlArr = unwrapXMLT1(xmlData);
  let headers = createHeaderNames(xmlArr);
  
  for (let i of headers) {
    let hCell = document.createElement("th");
    let hCellText = document.createTextNode(i);
    hCell.appendChild(hCellText);
    hRow.appendChild(hCell);
  }
  tblHead.appendChild(hRow);

  for (let xmlRow of xmlArr) {
    let row = document.createElement("tr");
    for (header of headers) {
      let cell = document.createElement("td");
      let cellText = xmlRow.get(header) ? document.createTextNode(xmlRow.get(header)) : document.createTextNode("");
      // if (xmlRow.get(header)===undefined) {
      //   cellText = document.createTextNode("hohoho");
      // } else {
      //   cellText = document.createTextNode(xmlRow.get(header));
      // }
      cell.appendChild(cellText);
      row.appendChild(cell);
    };
    tblBody.appendChild(row);
  };

  // put the <tbody> in the <table>
  tbl.appendChild(tblHead);
  tbl.appendChild(tblBody);
  // appends <table> into <body>
  body.appendChild(tbl);
};

function createDiv(item){
  let div = document.createElement("div");
  div.append(item);
  return div;
};
