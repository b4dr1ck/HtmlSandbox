const weekNames = ["So","Mo","Di","Mi","Do","Fr","Sa"];
const monthNames = ["Jänner","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
const weeksInMonth = 6;

let currentDate = new Date();
let month = parseInt(currentDate.getMonth()) + 1;
let year = currentDate.getFullYear();

let div = document.createElement("div");
let btn_wrapper = document.createElement("div");
let btn1 = document.createElement("button");
let btn2 = document.createElement("button");
let btn3 = document.createElement("button");
let h2 = document.createElement("h2");
    
document.body.appendChild(div);
div.appendChild(btn_wrapper);
div.appendChild(h2);
div.id = "calendar";

btn_wrapper.classList.add("flex");
btn_wrapper.appendChild(btn1);
btn_wrapper.appendChild(btn2);
btn_wrapper.appendChild(btn3);
btn1.textContent = "<";
btn2.textContent = "today";
btn3.textContent = ">";

document.getElementsByTagName("button")[0].addEventListener("click",switch_month);
document.getElementsByTagName("button")[1].addEventListener("click",switch_month);
document.getElementsByTagName("button")[2].addEventListener("click",switch_month);

create_calendar_table(year,month);

function switch_month(event) {
    let btn_text = event.target.textContent;
    switch (btn_text) {
        case ">":
            month += 1;
            if (month > 12) { 
                month = 1
                year += 1;
            };
            break;
        case "<":
            month -= 1;
            if (month < 1) { 
                month = 12;
                year -= 1;
            };
            break;
        case "today":
            month = parseInt(currentDate.getMonth()) + 1;
            year = currentDate.getFullYear();
            break;
    }
    create_calendar_table(year,month);
}

function create_calendar_table(year,month) {
    let currentDateFirst = new Date(year, month - 1,1);
    let currentDateZero = new Date(year, month, 0);
    let daysInMonth = currentDateZero.getDate();

    let firstDayInWeek = currentDateFirst.getDay();
    let currentDayInWeek = currentDate.getDate();

    if (document.getElementsByTagName("table")[0]) {
        document.getElementsByTagName("table")[0].remove();
    }

    let table = document.createElement("table");

    table.addEventListener("click", function(event) {
        let d=event.target.textContent;
        d = d < 10 ? "0" + d : d;
        let yyyymmm=document.querySelector("#calendar h2").getAttribute("yyyymm");
        let yyyymmdd = String(yyyymmm) + String(d);
    })

    div.appendChild(table);
    h2.textContent = `${monthNames[month - 1]} ${year}`;
    month = month < 10 ? "0" + month : month;
    h2.setAttribute("yyyymm",String(year) + String(month));

    create_header(table);
    create_body(table);

    function create_header(table) {
        let tr = document.createElement("tr");
        table.appendChild(tr)
        for (let day = 0; day < 7; day++) {
            let th = document.createElement("th");
            tr.appendChild(th);
            if (weekNames[day] == "So" || weekNames[day] == "Sa" ) {
                th.classList.add("free");
            }
            th.textContent = weekNames[day];
        }
    }

    function create_body(table) {
        let days_counter=1;
        for(let week = 0; week < weeksInMonth ; week++) {
            let tr = document.createElement("tr");
            table.appendChild(tr);
            for (let day = 0; day < 7; day++) {
                if (days_counter >daysInMonth ) { break;}

                let td = document.createElement("td");
                tr.appendChild(td);
                
                if (currentDayInWeek == days_counter && month == parseInt(currentDate.getMonth()) + 1 && year == currentDate.getFullYear() ) {
                    td.classList.add("active");
                }

                if (week == 0) {
                    if (day >= firstDayInWeek) {
                        td.textContent = days_counter;
                        days_counter++;
                    } else {
                        td.textContent = "";
                    }
                } else {
                    td.textContent = days_counter;
                    days_counter++;
                }
            }
        }
    }
}