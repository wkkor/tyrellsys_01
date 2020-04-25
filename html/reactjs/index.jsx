// To render player cards
class Cards extends React.Component {
    constructor(props) {
        super(props);

        this.card_type_ref = {
            '0': 'D',
            '1': 'C',
            '2': 'H',
            '3': 'S'
        };

        this.card_no_ref = {
            '1': 'A',
            '10': 'X',
            '11': 'J',
            '12': 'Q',
            '13': 'K'
        };
    }

    render() {
        let cards = this.props.value;
        let list_element = [];

        for (let i = 0; i < cards.length; i++) {
            // Convert to the card number to display
            let card_no = Math.floor(cards[i]/4)+1;
            
            if (card_no in this.card_no_ref){
                card_no = this.card_no_ref[card_no];
            }
            
            // Convert to the card type to display
            let card_type = this.card_type_ref[ cards[i]%4 ];
            list_element.push(card_type+'-'+card_no);
        }

        return (
            <div style={{ display: 'inline-block' }}>
                {list_element.join(',')}
            </div>
        );
    }
}

// To renter error message if result returned error
class ErrorMsg extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{ color: '#FF0000', fontWeight: 'bold' }}>
                {this.props.value}
            </div>
        );
    }
}

// To render result after form submit
class ResultOutput extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.response.status != 1) {
            return <ErrorMsg value={this.props.response.remark} />
        }

        let player_card_list = this.props.response.player_card_list;
        let list_element = [];
        for (let i = 0; i < player_card_list.length; i++) {
            list_element.push(<div>Player #{i + 1} = <Cards value={this.props.response.player_card_list[i]} /></div>);
        }

        return (

            <div>{list_element}</div>
        );
    }
}

// To render form
class SimpleForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: '', response: '' };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // Update user input for Number of people
    handleChange(event) { this.setState({ value: event.target.value }); }
    
    // Trigger when form submit
    handleSubmit(event) {

        var player_total = this.state.value;
        
        // Call api to get players card
        fetch(
            './get_players_card.php?player_total=' + player_total,
            {
                method: 'get',
                headers: {
                    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                }
            }
        ).then(
            (res) => {
                if (res.status !== 200) {
                    this.setState({ response: { status: 9, remark: "Irregularity occurred" } });
                    return;
                }

                res.json().then(
                    (data) => {
                        this.setState({ response: data });
                    }
                );

            },
            (error) => {
                this.setState({ response: { status: 9, remark: "Irregularity occurred" } });
            },
        ).catch(function (e) { this.setState({ response: { status: 9, remark: "Irregularity occurred" } }); });

        event.preventDefault();
    }

    render() {
        return (
            <div id="main">
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Number of people:
                        <input type="text" name="total_player" id="total_player" value={this.state.value} onChange={this.handleChange} placeholder="Value between 1 and 100" />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                <br />
                <br />
                <ResultOutput response={this.state.response} />
            </div>
        );
    }
}

ReactDOM.render(<SimpleForm />, document.getElementById('main'));