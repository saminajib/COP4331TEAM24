<?php
    $inData = getRequestInfo();

    $name = $inData->contact->name;
    $phone = $inData->contact->phone;
    $email = $inData->contact->email;
    $userId = $inData->userId;

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

    if($conn->connect_error)
    {
        http_response_code(500);
        returnWithError($conn->connect_error);
    }
    else
    {
            $stmt = $conn->prepare("SELECT ID FROM Users WHERE ID = ?");
            $stmt->bind_param('i', $userId);
            $stmt->execute();
            $stmt->store_result();

            if ($stmt->num_rows > 0)
            {
                $stmt->close();

                $stmt = $conn->prepare("INSERT INTO Contacts (Name, Phone, Email, UserID) VALUES (?, ?, ?, ?)");
                $stmt->bind_param('sssi', $name, $phone, $email, $userId);
                $stmt->execute();
                returnWithError("");
            }
            else
            {
                http_response_code(404);
                returnWithError("UserID not valid");
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