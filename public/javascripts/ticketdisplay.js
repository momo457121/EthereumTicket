function setupLives(liveJson) {
    var parent = document.getElementById("infoContent");
    for (var i=0 ; i<liveJson.length ; i++) {
        parent.appendChild(setLiveInfo(liveJson, i));
    }
}

function setLiveInfo(liveJson, i) {
    var showName = liveJson[i].name;
    var showId = liveJson[i].id;
    var liveBtn = document.createElement("BUTTON");
    liveBtn.className = "show_info_btn";
    liveBtn.id = "live" + showId;
    liveBtn.onclick = function() {getLiveInfo(showId);};
    liveBtn.textContent = showName;
    return liveBtn;
}

function setupSeats(showId) {
    var seatJson = liveJson[showId];

    var parent = document.getElementById("ticketContent");
    for (var i=0 ; i<seatJson.seat.length ; i++) {
        if (i != 0 && i % 5 == 0) {
            parent.appendChild(document.createElement("BR"));
            createSeatBuuton(showId, parent, seatJson.name, i);
        } else {
            createSeatBuuton(showId, parent, seatJson.name, i);
        }
    }
}

function createMenuOption(action, showId, showName, seatId) {
    var node = document.createElement("A");
    node.textContent = action;

    switch (action) {
        case "Buy":
            node.onclick = function() {buyTicket(showId, showName, seatId);};
            break;
        case "Refund":
            node.onclick = function() {refundTicket(showId, showName, seatId);};
            break;
        case "Release":
            node.onclick = function() {release(showId, showName, seatId);};
            break;
        case "TradeOwner":
            node.onclick = function() {tradeOwner(showId, showName, seatId);};
            break;
    }
    return node;
}

function createSeatBuuton(showId, parent, showName, seatId) {
    var Frame = document.createElement("DIV");
    Frame.className = "dropdown";

    var Button = document.createElement("BUTTON");
    Button.className = "dropbtn";
    Button.id = "seat_"+seatId;
    Button.textContent = seatId;
    Button.onclick = function() {CheckSeatState(showName, seatId, document.getElementById("myDropdown_"+seatId));};
    if (liveJson[showId].seat[seatId].state == "Buy") {
        Button.style.backgroundColor = "#ee7744";
    } else if (liveJson[showId].seat[seatId].state == "Release") {
        Button.style.backgroundColor = "#F781D8";
    } else {
        Button.style.backgroundColor = "#3498DB";
    }

    var dropMenu = document.createElement("DIV");
    dropMenu.className = "dropdown-content";
    dropMenu.id = "myDropdown_" + seatId;

    dropMenu.appendChild(createMenuOption("Buy", showId, showName, seatId));
    dropMenu.appendChild(createMenuOption("Refund", showId, showName, seatId));
    dropMenu.appendChild(createMenuOption("Release", showId, showName, seatId));
    dropMenu.appendChild(createMenuOption("TradeOwner", showId, showName, seatId));
    
    Button.appendChild(dropMenu);
    Frame.appendChild(Button);
    parent.appendChild(Frame);
}

var prev;
function CheckSeatState(showName, seat, element) {
    if (prev != null && element != prev) {
        document.getElementById(prev.id).classList.remove("show");
    }

    if (document.getElementById(element.id).classList.contains("show")) {
        document.getElementById(element.id).classList.remove("show");
        prev = null;
        return;
    }
    prev = element;
    document.getElementById(element.id).classList.toggle("show");
    // getSeatState(showName, seat);
}

