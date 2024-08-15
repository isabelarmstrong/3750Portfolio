import React, { useEffect, useState } from "react";

// One react component for the entire table (Records)
// another React component for each row of the result set (Record)
const Record = (props) => (
    <tr>
        <td>{props.record.name}</td>

    </tr>
)

export default function Records() {
    const [records, setRecords] = useState([]);

    useEffect(() => {
        async function getRecords(){
            const response = await fetch(`http://localhost:4000/record`);
            if(!response.ok){
                const message = `An error occured: ${response.statusText}`;
                window.alert(message);
                return;
            }
            const responseRecords = await response.json();
            setRecords(responseRecords);
            return;
        }
        getRecords();
        return;
    },[records.length]);

    function recordList() { 
        return records.map((record) => {
            return (
                <Record
                    record={record}
                    key={record._id}
                />
            );
        });
    }
    return (
        <div>
            <h3>Hello World</h3>
            <table style={{marginTop: 20}}>
                <thead>
                    <tr>
                        <th>Database Value: </th>
                    </tr>
                </thead>
                <tbody>{recordList()}</tbody>
            </table>
        </div>
    );
}