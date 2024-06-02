import logo from './logo.svg';
import './App.css';
import {
    Heading,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    NumberInput,
    NumberInputField,
    Button,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
  } from '@chakra-ui/react'
import Select from 'react-select'
import { useState, useEffect } from 'react';
import { BeatLoader } from 'react-spinners';
  
function App() {
    const [currencyList, setCurrencyList] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState(null);
    const [inputValue, setInputValue] = useState(0);
    const [canSubmit, setCanSubmit] = useState(false);
    const [result, setResult] = useState(0);
    const [loading, setLoading] = useState(false);

    if(!canSubmit && selectedCurrency && inputValue > 0){
        setCanSubmit(true);
    }
    //Get list currency on web
    useEffect(() => {
        const url = 'https://interview.switcheo.com/prices.json';
        fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const expandList = data.map((item)=>{
                item['value'] = item.currency;
                item['label'] = item.currency;
                return item;
            })
            setCurrencyList(expandList);
        })
      }, []);
    
    // console.log("Expand List: ", currencyList);

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        
        setTimeout(()=>{
            setResult(selectedCurrency.price * inputValue);
            setLoading(false);
        }, 2000);
        // const selectedPrice = selectedCurrency.price;
        // setResult(selectedPrice * inputValue);
    };

    const handleChange = (event) => {
        const inputValue = event.currentTarget.input.value;
        setInputValue(inputValue);
        if (inputValue > 0 && selectedCurrency !== null){
                setCanSubmit(true);
        }else{
            setCanSubmit(false);
        }
    }

    return <form onSubmit={handleSubmit} onChange={handleChange}>
    <FormControl isInvalid={!canSubmit}>
        <TableContainer>
        <Table variant='simple' size='md'>
            <TableCaption>Currency Swap Form</TableCaption>
            <Thead>
            <Tr>
                <Th style={{width:"50%"}}><Heading>From Currency</Heading></Th>
                <Th><Heading>To USD</Heading></Th>
            </Tr>
            </Thead>
            <Tbody>
            <Tr>
                <Td>
                    <FormLabel>Currency</FormLabel>
                    <Select options={currencyList} 
                        onChange={option=>{
                            setSelectedCurrency(option);
                        }}
                        formatOptionLabel={currency => (
                            <div
                            style={{display:"flex"}}>
                                <img 
                                style={{marginRight:"5px",height:"30px",width:"30px"}}
                                src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${currency.label}.svg`} 
                                alt={`${currency.label}-icon`} />
                                <div style={{alignSelf:"center"}}>{currency.label}</div>
                            </div>
                      )} 
                    />
                    {(!selectedCurrency) && <FormErrorMessage style={{display:"inline"}}>A currency should be selected.</FormErrorMessage>}
                </Td>
            </Tr>
            <Tr>
                <Td>
                    <FormLabel>Amount to be converted</FormLabel>
                    <NumberInput name='input'>
                        <NumberInputField />
                    </NumberInput>
                    {!(inputValue > 0) && <FormErrorMessage>A positive number should be entered.</FormErrorMessage>}
                </Td>
                <Td>
                    <FormLabel style={{fontWeight:'bold'}}>Result</FormLabel>
                      <strong>{`$ ${result}`}</strong>
                </Td>
            </Tr>
            <Tr>
                <Td>
                    <Button
                        mt={4}
                        colorScheme='teal'
                        type='submit'
                        isDisabled={!canSubmit}
                    >
                        Submit
                    </Button>
                    {loading && <BeatLoader color="#36d7b7" />}
                </Td>
            </Tr>
            </Tbody>
            <Tfoot>
            </Tfoot>
        </Table>
        </TableContainer>
    </FormControl>
</form>
}

export default App;
