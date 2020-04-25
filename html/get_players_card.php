<?php

header('Content-Type: application/json');

/*
* Use for JSON, status=1 means success, else failed
* remark is additional message
* additional player_card_list key created which store players cards as array
* where player_card_list formatted player_no => cards in array
*/

$result = [
    "status" => 1,
    "remark" => "OK"
];

$player_total = $_GET['player_total'];

switch (true) {
    default:
        // Invalid input
        if (!filter_var(
            $player_total,
            FILTER_VALIDATE_INT,
            ['options' => ['min_range' => 1, 'max_range' => 100]]
        )) {
            $result['status'] = 9;
            $result['remark'] = 'Input value does not exist or value is invalid';
            break;
        }

        /*
        * 0 ~ 51 represent for 52 cards
        * where the value % 4 represent D, C, H, S respectively
        * and value / 4 round down +1 is the card number
        */

        $cards_arr = range(0, 51);
        shuffle($cards_arr);

        $players_card = [];

        $offset = 0;

        // Assign cards to players
        for ($i = 0; $i < $player_total; $i++) {

            $card_limit = floor(count($cards_arr) / $player_total) + (count($cards_arr) % $player_total > $i && 1);

            $players_card[$i] = array_slice($cards_arr, $offset, $card_limit);
            sort($players_card[$i]);

            $offset += $card_limit;
        }

        $result['player_card_list'] = $players_card;
        break;
}

echo json_encode($result);
