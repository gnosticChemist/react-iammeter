import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';

function App() {
  const [connectionStatus, setConnectionStatus] = React.useState(false);
  const [messages, setMessages] = React.useState([]);

  useEffect(() => {
    const client = mqtt.connect("mqtt://test.mosquitto.org:8080");
    client.on('connect', () => {
      console.log("Conectado");
      setConnectionStatus(true);
      const topic = 'device/51C0974E/realtime'
      client.subscribe([topic], () => {
        console.log(`Subscribe to topic '${topic}'`)
      });
    });
    client.on('message', (topic, payload, packet) => {
      const obj = JSON.parse(payload);
      setMessages(obj);
      console.log(obj);
    });
  }, []);

  let tableContent = [];
  if(messages.Datas)messages.Datas.forEach((m, i) => {
      tableContent.push(<tr>
                        <td>{i}     </td>
                        <td>{m[0]} V</td>
                        <td>{m[1]} A</td>
                        <td>{m[2]} W</td>
                        <td>{m[3]} kWh</td>
                        <td>{m[4]} kWh</td>
                        <td>{m[5]} Hz</td>
                        </tr>);
  });

  //return messages.map( (message) => {<>
  return (<>
        <table>
        <tr><th>Fase</th><th>Tensão</th><th>Corrente</th><th>Potência</th><th>Energia Consumida</th><th>Energia Gerada</th><th>Frequência</th></tr>
        {tableContent}
        </table>
        </>
  );
}

export default App;
