pragma solidity ^0.4.23;
import "./MoToken.sol";


contract TicketTrade {

    struct Show {
        string name;
        address creater;
        Seat[] seats;
    }
    
    struct Seat {
        string showName;
        uint cost; // cost of the seat
        uint block;
        uint seat;
        bool release;
        address owner; 
    }

    mapping (string => Show) shows;
    address chairPerson;
    MoToken moContract;

    constructor(address tokenAddr) public {
        chairPerson = msg.sender;
        moContract = MoToken(tokenAddr);
    }

    function SystemOwner() public view returns (address) {
        return chairPerson;
    }

    function SeatInfo(string show_index, uint seat_index) public view returns (string, uint, uint, uint, address, bool) {
        /*
            Input : showName, seat index
            Output : showName, cost, block, seat, owner
        */

        Show storage show = shows[show_index];
        Seat storage seat = show.seats[seat_index];
        return (seat.showName, seat.cost, seat.block, seat.seat, seat.owner, seat.release);
    }

    function liveOpen(string _showName, uint[] _seatList, uint[] _blocksList, uint[] _costList) public {
        Show storage show = shows[_showName];
        show.name = _showName;
        show.creater = msg.sender;

        for (uint i = 0; i < _seatList.length; i++) {
            show.seats.push(Seat({
                showName: _showName,
                cost: _costList[i],
                block: _blocksList[i],
                seat: _seatList[i],
                release: false,
                owner: 0
            }));
        }
    }


    function buy(string _showName, uint seat_index) public {
        Show storage show = shows[_showName];

        //Check ticket is not sale out
        require(show.seats[seat_index].owner == address(0));
        require(moContract.balanceOf(msg.sender) >= show.seats[seat_index].cost);
        
        //cost money from msg.owner and pay for system
        moContract.payment(msg.sender, show.seats[seat_index].cost);
        show.seats[seat_index].owner = msg.sender;
    }
    
    function checkWallet(address addr) public view returns(uint) {
        return moContract.balanceOf(addr);
    }
    
    event Print(string _name, uint addr);

    function refund(string _showName, uint seat_index) public {
        Show storage show = shows[_showName];

        //Check the seat owner is msg.sender
        require(show.seats[seat_index].owner == msg.sender);

        //send cost money back to msg.owner, one point for fax
        moContract.refund(msg.sender, show.seats[seat_index].cost);
        show.seats[seat_index].owner = address(0);
        show.seats[seat_index].release = false;
    }

    function release(string _showName, uint seat_index, bool state) public {
        Show storage show = shows[_showName];

        require(show.seats[seat_index].owner == msg.sender);
        show.seats[seat_index].release = state;
    }

    function tradeOwner(string _showName, uint seat_index) public {
        Show storage show = shows[_showName];

        //Check addr has enounth token to pay for ticket owner
        require(moContract.balanceOf(msg.sender) >= show.seats[seat_index].cost);

        //Check the ticket is state is release
        require(show.seats[seat_index].release == true);

        //cost money from msg.sender and send to seat owner
        moContract.transferWithApprove(msg.sender, show.seats[seat_index].owner, show.seats[seat_index].cost);
        show.seats[seat_index].owner = msg.sender;
        show.seats[seat_index].release = false;
    }
}

