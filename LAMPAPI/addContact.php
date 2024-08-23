<?php
    $inData = getRequestInfo();

    $ID = $inData->contact->ID;
    $Name = $inData->contact->Name;
    $Phone = $inData->contact->Phone;
    $Email = $inData->contact->Email;
    $userId = $inData->userID;

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        $stmt = $conn->prepare("INSERT into Contacts (ID, Name, Phone, Email, UserID) VALUES(?, ?, ?, ?, ?)");
        $stmt->bind_param("isssi", $ID,  $Name, $Phone, $Email, $userId);
        $stmt->execute();
        $stmt->close();
        $conn->close();
        returnWithError("");
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'));
    }

	function sendResultInfoAsJson( $obj )
    {
        header('Content-type: application/json');
        echo $obj;
    }

	function returnWithError( $err )
    {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }
?>