import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Container, Form, Input, Label } from 'reactstrap'

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

function App() {
  const [pairs, setPairs] = useState()
  const [loading, setLoading] = useState(true)

  const updatePairs = async () => {
    const resp = await (await fetch('http://localhost:3001/api')).json()
    console.log(resp)
    return resp
  }

  useEffect(async () => {
    const pairs = await updatePairs()
    console.log('pairs,', pairs)
    setPairs(pairs)
    setLoading(false)
  }, [])

  if (loading) {
    return <h1>she loading</h1>
  } else {
    return (
      <Container>
        <InputForm>
          <h2>Hello World</h2>
          <Form>
            <Label for="pair">Select Pair</Label>
            <Input id="pair" name="pair" type="select">
              {options}
            </Input>
            <Input />
            <Input />
          </Form>
        </InputForm>
      </Container>
    )
  }
}

export default App
