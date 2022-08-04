import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import axios from 'axios'
import './Home.css'

let serverTime = null;

const Home = () => {
    const [loading, setLoading] = useState(false);
    //const [serverTime, setServerTime] = useState(null);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [epoch, setEpoch] = useState(0);

    const [metrics, setMetrics] = useState('');

    useEffect(() => {

        async function fetchData() {
            /* await axios.get(process.env.REACT_APP_BACKEND + '/time', {
                headers: {
                    'Authorization': 'mysecrettoken'
                }
            }) */
            await axios.get(process.env.REACT_APP_BACKEND + '/time')
                .then(res => {
                    setLoading(true)
                    setEpoch(res.data.epoch)
                    serverTime = (Math.floor(res.data.epoch / 1000))
                    const clientTime = Date.now();
                    const difference = Math.floor(clientTime / 1000) - serverTime;
                    const hours = Math.floor(difference / 3600) < 10 ? '0' + Math.floor(difference / 3600) : Math.floor(difference / 3600);
                    const minutes = Math.floor((difference % 3600) / 60) < 10 ? '0' + Math.floor((difference % 3600) / 60) : Math.floor((difference % 3600) / 60);
                    const seconds = difference % 60 < 10 ? '0' + difference % 60 : difference % 60;
                    setHours(hours);
                    setMinutes(minutes);
                    setSeconds(seconds);
                })
                .catch(err => {
                    console.log(err);
                });
            /* await axios.get(process.env.REACT_APP_BACKEND + '/metrics', {
                headers: {
                    'Authorization': 'mysecrettoken'
                }
            }) */
            await axios.get(process.env.REACT_APP_BACKEND + '/metrics')
                .then(res => {
                    setLoading(true)
                    setMetrics(res.data);
                })
                .catch(err => {
                    console.log(err);
                });
        }
        fetchData();

        //refreshInterval 
        setInterval(() => {
            const clientTime = Date.now();
            const difference = Math.floor(clientTime / 1000) - serverTime;
            const hours = Math.floor(difference / 3600) < 10 ? '0' + Math.floor(difference / 3600) : Math.floor(difference / 3600);
            const minutes = Math.floor((difference % 3600) / 60) < 10 ? '0' + Math.floor((difference % 3600) / 60) : Math.floor((difference % 3600) / 60);
            const seconds = difference % 60 < 10 ? '0' + difference % 60 : difference % 60;
            setHours(hours);
            setMinutes(minutes);
            setSeconds(seconds);
        }, 1000)

        //requestInterval 
        setInterval(async () => {
            /* await axios.get(process.env.REACT_APP_BACKEND + '/time', {
                headers: {
                    'Authorization': 'mysecrettoken'
                }
            }) */
            await axios.get(process.env.REACT_APP_BACKEND + '/time')
                .then(res => {
                    setLoading(true)
                    setEpoch(res.data.epoch)
                    serverTime = (Math.floor(res.data.epoch / 1000))
                })
                .catch(err => {
                    console.log(err);
                });
            /* axios.get(process.env.REACT_APP_BACKEND + '/metrics', {
                headers: {
                    'Authorization': 'mysecrettoken'
                }
            }) */
            await axios.get(process.env.REACT_APP_BACKEND + '/metrics')
                .then(res => {
                    setLoading(true)
                    setMetrics(res.data);
                })
                .catch(err => {
                    console.log(err);
                });
        }, 30000)

    }, []);

    return (
        <>
            {
                !loading ? <h1>Loading</h1> :
                    <Container fluid>
                        <Row>
                            <Col md={6} xs={12} className="div1" >
                                <div style={{ color: "white" }}>
                                    <p>The most recently-fetched value for server time is:</p>
                                    <h1>{epoch}</h1>
                                    <p>The difference between current client machine time and the most recently-fetchedvalue is :</p>
                                    <h1>{hours} : {minutes} : {seconds}</h1>
                                </div>
                            </Col>
                            <Col md={6} xs={12} >
                                <pre style={{ overflow: "scroll", height: '100vh' }}>{metrics}</pre>
                            </Col>
                        </Row>
                    </Container>
            }
        </>
    )
}

export default Home