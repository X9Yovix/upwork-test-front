import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import axios from 'axios'
import './Home.css'


const Home = () => {
    const [loading, setLoading] = useState(false);
    const [time, setTime] = useState('');
    const [epoch, setEpoch] = useState('');
    const [timeDiff, setTimeDiff] = useState('');
    const [metrics, setMetrics] = useState('');

    useEffect(() => {

        axios.get(process.env.REACT_APP_BACKEND + '/time')
            .then(res => {
                setLoading(false);
                setEpoch(res.data.epoch);
                console.log(res.data);
                // no need setTime(new Date().toLocaleTimeString());
            })
            .catch(err => {
                console.log(err);
            });
            
        const interval = setInterval(() => {
            const startDate = new Date(epoch);
            const endDate = new Date();

            const seconds = (endDate.getTime() - startDate.getTime()) / 1000;

            const measuredTime = new Date(null);
            measuredTime.setSeconds(seconds);
            setTimeDiff(measuredTime.toISOString().substr(11, 8));

            /* axios.get(process.env.REACT_APP_BACKEND + '/time', {
                headers: {
                    'Authorization': 'mysecrettoken'
                }
            }) */
            axios.get(process.env.REACT_APP_BACKEND + '/time')
                .then(res => {
                    setLoading(false);
                    setEpoch(res.data.epoch);
                    console.log(res.data);
                    // no need setTime(new Date().toLocaleTimeString());
                })
                .catch(err => {
                    console.log(err);
                });
            axios.get(process.env.REACT_APP_BACKEND + '/metrics')
                .then(res => {
                    setLoading(false);
                    //setMetrics(res.data.metrics);
                    //console.log(res.data);
                })
                .catch(err => {
                    console.log(err);
                });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Container fluid>
                <Row>
                    <Col md={6} xs={12} className="div1" >
                        {
                            loading ?
                                <h1>Loading</h1>
                                :
                                <div style={{ color: "white" }}>

                                    <p>The most recently-fetched value for server time is:</p>
                                    <h1>{epoch}</h1>
                                    <p>The difference between current client machine time and the most recently-fetchedvalue is :</p>
                                    <h1>{timeDiff}</h1>
                                </div>
                        }

                        <br />

                    </Col>
                    <Col md={6} xs={12} >


                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Home