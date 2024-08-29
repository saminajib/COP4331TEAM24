<?php
    $inData = getRequestInfo();

    $Name = $inData->contact->Name;
    $Phone = $inData->contact->Phone;
    $Email = $inData->contact->Email;
    $userId = $inData->userId;

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        $stmt = $conn->prepare("insert into Contacts (Name, Phone, Email, UserID) values (?, ?, ?, ?)");
        $stmt->bind_param('sssi',$Name,$Phone,$Email,$userId);
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