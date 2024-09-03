<?php
    $inData = getRequestInfo();

    $Id = $inData->contact->id;
    $Name = $inData->contact->name;
    $Phone = $inData->contact->phone;
    $Email = $inData->contact->email;





    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        $stmt = $conn->prepare("UPDATE Contacts SET Name=?, Phone=?, Email=? WHERE Id=?");
        $stmt->bind_param("sssi", $Name, $Phone, $Email, $Id);
        $stmt->execute();

        if($stmt->affected_rows > 0) //contact in database successfully edited
        {
            returnWithError("");
        }
        else
        {
            returnWithError("Contact doesn't exist or no changes made!");
        }
        $stmt->close();
        $conn->close();
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