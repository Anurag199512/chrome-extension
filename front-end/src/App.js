import './App.css';
import 'reactjs-popup/dist/index.css';
import * as cheerio from 'cheerio'
import * as axios from 'axios'
import { useState } from 'react';
import Popup from 'reactjs-popup';

function App() {
  const [productName, setName] = useState("");
  const [avgPrice, setAveragePrice] = useState(0);
  const [showPopUp, managePopUp] = useState(false);

  const fetchData = async (e) => {
    managePopUp(false);
    e.preventDefault()

    if (productName.length === 0) {
      alert('Please input a product name to find the average');
      return;
    }
  
    const serverUrl = 'http://localhost:3000/fetch-product-data';
    let total = 0, totalCount =0;

    axios.default.post(serverUrl, {
      productName
    }).then((res) => {
      const html = res.data;
  
      const $ = cheerio.load(html);
      $('div.a-row.a-size-base.a-color-base').each((_idx, el) => {
        const shelf = $(el)
        const numericPart = shelf.find('span.a-price-whole').text() ?? 0
        const fractionPart = shelf.find('span.a-price-fraction').text() ?? 0
    
        console.log('p', numericPart, fractionPart, total)

        if (numericPart > 0 || fractionPart > 0) {
          total = total + Number(numericPart) + Number(fractionPart);
          totalCount = totalCount + 1;  
        }
      })
  
      setAveragePrice((total / totalCount).toFixed(2));
      managePopUp(true);

      // alert(`Average price of the product ${productName} is $${(total / totalCount).toFixed(2)}`)
    }).catch((e) => {
      console.log('Error', e)
    })
  }

  return (
    <div className='App'>
      { showPopUp  ?
        <Popup position="top right" open = {showPopUp}>
          <div>Average price of the product <b>{productName}</b> is <b>${avgPrice}</b> </div>
        </Popup>
      : <p></p>
      }

      <header className='App-header'>
      <form onSubmit={ fetchData }>
        <div class='form-row align-items-center'>
          <div class='col-auto'>
            <input type='text' class='form-control mb-2' id='inlineFormInput' placeholder='Search a product' onChange={(e) => setName(e.target.value)}/>
          </div>

          <div class='col-auto'>
            <button type='submit' class='btn btn-primary mb-2'>Submit</button>
          </div>
        </div>
      </form>
      </header>
    </div>
  );
}

export default App;
