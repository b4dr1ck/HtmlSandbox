
const create_browsing_graph = (target,object) => {
    let div = document.createElement("div");

    if (target.getElementsByTagName("div").length > 0) {
        target.textContent = "";
    }

    target.appendChild(div);
    div.classList.add("object_browsing");
    div.addEventListener("click", function(e) {
        let nextSibl =  e.target.nextSibling;
        let p =  e.target;
        if (!nextSibl) { return;}

        nextSibl.classList.toggle("disappear");

        if (nextSibl.classList.contains("disappear")) {
            p.textContent = p.textContent.replace("[-]","[+]");
        } else {
            p.textContent = p.textContent.replace("[+]","[-]");
        }
    })

    const browse = (obj,div) => {
        if (obj == null || obj == undefined) {
            div.appendChild(document.createElement("p")).textContent = 'Null';
            return;
        }

        let obj_name = obj.constructor.name;
        if (obj_name == "Array") {
            obj.forEach(function(element,index) {
                let p = document.createElement("p");
                p.classList.add("array");
                div.classList.add("array");
                div.appendChild(p).textContent = `[-] ${index}:`;
                browse(element,  div.appendChild(document.createElement("div")));
            })
        } else if (obj_name == "Object")   {
            for (let key in obj) {
                let p = document.createElement("p");
                p.classList.add("dict");
                div.classList.add("dict");
                div.appendChild(p).textContent = `[-] ${key}:`;
                browse(obj[key], div.appendChild(document.createElement("div")));
            }
        } else {
            let p = document.createElement("p");
            switch (obj_name) {
                case 'Boolean': 
                    p.classList.add("bool"); 
                    div.appendChild(p).textContent = obj;
                    break;
                case 'Number':  
                    p.classList.add("number"); 
                    div.appendChild(p).textContent = obj;
                    break;
                case 'String':  
                    p.classList.add("string"); 
                    div.appendChild(p).textContent = '"' + obj + '"';
                    break;
                case "Function":
                    p.classList.add("function");
                    div.appendChild(p).textContent = obj.name + "(" + obj.toString().replace(/function\((.*)\).*/,'$1') + ")";
                    break;
                default:
                    div.appendChild(p).textContent = obj_name;
                    break;
            };
        }
    }

    browse(object,div);
}
