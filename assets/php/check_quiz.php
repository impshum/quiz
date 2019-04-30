<?php


$user_answers = $_POST['all_answers'];

$json = file_get_contents('../json/quiz_answers.json');
$answers = json_decode($json);
$correct = 0;

foreach ($answers as $item) {
    if ($user_answers[$item->title] == $item->answer) {
        $correct++;
    }
    $total++;
}

$messages = array("none" => "Well done. You're a moron.", "low" => "Not quite the word genius you were expecting? Grab a dictionary.", "medium" => "Nearly there. Keep your spirits high and power on.", "high" => "You're good but not that good. You might get it the second time round.", "perfect" => "Perfect score. You blasted that one off. Good job.");
$percentage = round(($correct * 100) / $total);

if ($percentage == 0) {
    $message = $messages['none'];
} elseif ($percentage >= 30) {
    $message = $messages['low'];
} elseif ($percentage >= 60) {
    $message = $messages['medium'];
} elseif ($percentage >= 90) {
    $message = $messages['high'];
} elseif ($percentage == 100) {
    $message = $messages['perfect'];
}

echo json_encode(array('percentage' => $percentage, 'correct' => $correct, 'total' => $total, 'message' => $message));
