import React, { useState } from 'react';
import './HomePage.css';
import logo from '../Assets/logo.png';
import click from '../Assets/click.gif';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import ParameterList from '../Components/ParameterList';
import YoutubeVideo from '../Components/YoutubeVideo';
import qrimg1 from '../Assets/qr-img-40.jpeg';
import qrimg2 from '../Assets/qr-img-99.jpeg';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// No need to call toast.configure() separately

const HomePage = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentOption, setPaymentOption] = useState('');
  const [amountOption, setAmountOption] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [isLoading, setIsLoading] = useState(false);

  const handleInstantReportClick = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentOptionClick = (option) => {
    setPaymentOption(option);
    setAmountOption(null); // Reset the amount selection
  };

  const handleAmountOptionClick = (amount) => {
    setAmountOption(amount);
  };

  const handleConfirmPayment = () => {
    const payload = {
      amount: amountOption,
      name: 'Dhanush',
      mobile: 1234567890,
      paymentMethod: paymentOption,
    };

    setIsLoading(true);

    const timeout = setTimeout(() => {
      setIsLoading(false);
      toast.error('Payment is taking too long, please try again later.');
    }, 60000); // 1 minute timeout

    fetch('https://kiosk-q5q4.onrender.com/user-reciept/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to process payment. Please try again.');
        }
        return response.json();
      })
      .then((data) => {
        clearTimeout(timeout); // Clear the timeout if the API succeeds
        setIsLoading(false);
        setPaymentStatus('success');
        toast.success('Payment successful!');
      })
      .catch((error) => {
        clearTimeout(timeout); // Clear the timeout if there's an error
        setIsLoading(false);
        toast.error(error.message || 'Payment failed. Please try again.');
        setPaymentStatus('failed'); // Set payment status to failed
      });
  };

  // Ensure the modal only closes when payment status is 'success'
  const closeModal = () => {
    setShowPaymentModal(false);
    setPaymentOption('');
    setAmountOption(null);
    setPaymentStatus('pending'); // Reset payment status when closing the modal
  };
  

  return (
    <div className="homepage-container">
      {/* Logo */}
      <div className="header-container">
        <div className="image-container">
          <img src={logo} alt="Atmaprikash Logo" className="logo" />
        </div>
        <h1 className="title">Health ATM (Vitals Checking Machine)</h1>
      </div>
      <p className="subtitle">Check Your Vitals, Instant Report</p>

      <div className="instant-report-section">
        <button className="instant-report-button" onClick={handleInstantReportClick}>
          Check Your Vitals
          <img src={click} alt="" style={{ width: "50px", borderRadius: '50px' }} />
        </button>
      </div>

      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>

            {paymentStatus === 'pending' && (
              <>
                {!paymentOption ? (
                  <>
                    <h1>Select Payment Option</h1>
                    <div className="payment-options">
                      <button onClick={() => handlePaymentOptionClick('QR')}>QR Code</button>
                      <button onClick={() => handlePaymentOptionClick('Cash')}>Cash</button>
                    </div>
                  </>
                ) : null}

                {paymentOption && !amountOption && (
                  <>
                    <h2>Select Amount</h2>
                    <div className="amount-options">
                      <button onClick={() => handleAmountOptionClick(40)}>40/-</button>
                      <button onClick={() => handleAmountOptionClick(99)}>99/-</button>
                    </div>
                  </>
                )}

                {amountOption && paymentOption === 'QR' && (
                  <>
                    <h3>Scan the QR Code for {amountOption}/-</h3>
                    {amountOption === 40 && <img src={qrimg1} alt="QR Code for 40 INR" className="qr-code-image" />}
                    {amountOption === 99 && <img src={qrimg2} alt="QR Code for 99 INR" className="qr-code-image" />}
                    <button className="confirm-payment-button" onClick={handleConfirmPayment} disabled={isLoading}>
                      {isLoading ? 'Processing...' : 'Confirm Payment'}
                    </button>
                  </>
                )}

                {amountOption && paymentOption === 'Cash' && (
                  <>
                    <h3>You have selected to pay {amountOption}/- by Cash</h3>
                    <button className="confirm-payment-button" onClick={handleConfirmPayment} disabled={isLoading}>
                      {isLoading ? 'Processing...' : 'Confirm Payment'}
                    </button>
                  </>
                )}
              </>
            )}

            {paymentStatus === 'success' && (
              <div className="success-modal">
                <h1>Payment Successful!</h1>
                <FontAwesomeIcon icon={faCircleCheck} size="6x" style={{ color: "#0ff05e" }} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image and Parameters List */}
      <ParameterList />

      {/* Video Section */}
      <YoutubeVideo />
    </div>
  );
};

export default HomePage;
