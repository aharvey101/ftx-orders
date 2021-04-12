import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import {
  Container,
  Form,
  FormGroup,
  Input,
  Col,
  Label,
  Button,
  Spinner,
} from 'reactstrap'

const url =
  process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api'

const InputForm = styled.div`
  display: flex;
  /* align-items: center; */
  /* justify-content: center; */
  flex-direction: column;
  min-width: 10rem;
  min-height: 25rem;
  background-color: red;
  padding: 1rem;
  margin: 1rem;
`

const Row = styled.div`
  display: flex;
  gap: 1rem;
`

const Long = styled.a`
  color: ${(props) => props.inputColor || 'black'};

  :hover {
    cursor: pointer;
    color: white;
    text-decoration: none;
  }
  h3 {
    font-size: 20px;
    font-weight: 400;
  }
`

function App() {
  const [pairs, setPairs] = useState([])
  const [loading, setLoading] = useState(true)
  const [pair, setPair] = useState('BTC-PERP')
  const [direction, setDirection] = useState('Long')
  const [order, setOrder] = useState({})
  const [amountUSD, setamountUSD] = useState(1)
  const [price, setPrice] = useState(1)
  const [orderType, setOrderType] = useState('limit')
  const [limitPrice, setLimitPrice] = useState(1)
  const [balance, setBalance] = useState(1)

  const getPairs = async () => {
    const resp = await (await fetch('http://localhost:3001/api')).json()
    return resp
  }

  const changeDirection = (e) => {
    e.preventDefault()

    const direction = e.target.id
    setDirection(direction)
    setOrder((ps) => ({ ...ps, direction: direction }))
  }

  const selectPair = (e) => {
    e.preventDefault()
    setPair(e.target.value)
    setOrder((ps) => ({ ...ps, [e.target.id]: e.target.value }))
  }

  const addToOrder = (e) => {
    const { value, id } = e.target
    e.preventDefault()
    setOrder((ps) => ({ ...ps, [id]: value }))
  }

  const setAmountUSD = (e) => {
    // const { value, id } = e.target
    const v = e.target.value
    const amountUsd = v * price
    setamountUSD(amountUsd)
  }

  const getBalance = async (e) => {
    e.preventDefault()
    const resp = await fetch('http://localhost:3001/api/balance')
    setBalance(resp)
  }

  const handleOrderTypeChange = (e) => {
    const { value, id } = e.target
    setOrder((ps) => ({ ...ps, orderType: value }))
    setOrderType(value)
  }

  useEffect(async () => {
    const pairs = await getPairs()
    const perps = pairs.filter((pairObject) => {
      if (pairObject.info.name.includes('-PERP')) {
        return true
      }
    })
    setPairs(perps)
    setLoading(false)
  }, [])

  const options = pairs.map((pair) => (
    <option key={pair.id}>{pair.symbol}</option>
  ))

  const orderTypes = [
    'Limit',
    'Stop',
    'Stop Limit',
    'Stop Market',
    'Take Profit',
  ]
  const orderTypeOptions = orderTypes.map((type) => (
    <option key={type}>{type}</option>
  ))
  console.log(order)
  if (loading) {
    return <Spinner color="primary" />
  } else {
    return (
      <Container>
        <InputForm>
          <Form>
            <FormGroup>
              <Row>
                <Col style={{ alignSelf: 'flex-end' }}>
                  <Long
                    style={{ alignSelf: 'flex-end' }}
                    id="Buy"
                    onClick={changeDirection}
                    inputColor={() => {
                      if (direction === 'Buy') {
                        return 'white'
                      } else {
                        return 'black'
                      }
                    }}
                  >
                    <h3 name="direction" id="Buy">
                      Buy {pair}
                    </h3>
                  </Long>
                </Col>
                <Col>
                  <Long
                    id="Sell"
                    onClick={changeDirection}
                    inputColor={() => {
                      if (direction === 'Sell') {
                        return 'white'
                      } else {
                        return 'black'
                      }
                    }}
                  >
                    <h3 name="direction" id="Sell">
                      Sell {pair}
                    </h3>
                  </Long>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Label
                    style={{ padding: 0, margin: 0, fontSize: '10px' }}
                    size="sm"
                    for="pair"
                  >
                    Select Pair
                  </Label>
                  <Row>
                    <Input
                      size="sm"
                      id="pair"
                      name="pair"
                      type="select"
                      style={{ width: '89.5%', height: '25%' }}
                      onClick={selectPair}
                    >
                      {options}
                    </Input>
                    <Button
                      style={{ padding: 0 }}
                      size="sm"
                      className="btn-primary"
                      style={{ fontSize: '10px' }}
                      onClick={getBalance}
                    >
                      Get Balance
                    </Button>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Label
                    size="sm"
                    style={{ padding: 0, margin: 0, fontSize: '10px' }}
                    for="price"
                  >
                    Price
                  </Label>
                  <Row>
                    <Input
                      style={{ padding: 0, margin: 0, width: '500%' }}
                      type="number"
                      size="sm"
                      id="price"
                      onChange={(e) => (
                        addToOrder(e), setPrice(e.target.value)
                      )}
                    />

                    <Input
                      style={{ padding: 0, margin: 0 }}
                      size="sm"
                      type="select"
                      onChange={handleOrderTypeChange}
                    >
                      {orderTypeOptions}
                    </Input>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col style={{ margin: 0, padding: 0 }}>
                  <Row>
                    <Col>
                      <Label
                        for="amountAsset"
                        size="sm"
                        style={{ padding: 0, margin: 0, fontSize: '10px' }}
                      >
                        Amount (Asset)
                      </Label>

                      <Input
                        id="amountAsset"
                        type="number"
                        onChange={(e) => (addToOrder(e), setAmountUSD(e))}
                      />
                    </Col>
                    <Col>
                      <Label
                        for="amountUSD"
                        size="sm"
                        style={{ padding: 0, margin: 0, fontSize: '10px' }}
                      >
                        Amount (USD)
                      </Label>
                      <Input
                        defualtValue={amountUSD}
                        id="amountUSD"
                        type="number"
                      ></Input>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </FormGroup>
          </Form>
        </InputForm>
      </Container>
    )
  }
}

export default App
