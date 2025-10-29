import { MdAdd, MdRemove, MdShoppingCart, MdCheckCircle, MdLocalOffer } from "react-icons/md";
import { useState } from "react";

export default function MyBuyPopup({
    closePopup,
    popupstyles = {},
    data: {
        productName = "",
        productId = "",
        productPrice = 0,
        productImage = "",
        productDescription = "",
        productStock = 0,
        allowQuantityChange = true,
        showShipping = false,
        shippingPrice = 1,
        freeShippingThreshold = 10.00,
        acceptedPaymentMethods = ["Credit Card", "PIX"],
        allowCoupon = true,
        getCoupon = (code) => { return { error: true, errorMessage: "Invalid coupon" } },
        onBuy = () => { }
    } = {}
}) {
    const [quantity, setQuantity] = useState(1);
    const [step, setStep] = useState(1);
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState("");
    const [couponLoading, setCouponLoading] = useState(false);

    // Calculations
    const subtotal = productPrice * quantity;
    const shipping = showShipping && subtotal < freeShippingThreshold ? shippingPrice : 0;

    let discount = 0;
    if (appliedCoupon) {
        if (appliedCoupon.type === "percent") {
            discount = (subtotal * appliedCoupon.discount) / 100;
        } else {
            discount = appliedCoupon.discount;
        }
    }

    const total = subtotal + shipping - discount;

    const handleQuantityChange = (delta) => {
        const newQty = quantity + delta;
        if (newQty >= 1 && newQty <= productStock) {
            setQuantity(newQty);
        }
    };

    const handleApplyCoupon = async () => {
        const trimmedCode = couponCode.trim().toUpperCase();
        if (!trimmedCode) {
            setCouponError("Enter a coupon code");
            return;
        }

        setCouponLoading(true);
        const { error, errorMessage, coupon } = await getCoupon(trimmedCode)
        setCouponLoading(false)

        if (!error) {
            setAppliedCoupon(coupon);
            setCouponError("");
        } else {
            setCouponError(errorMessage || "Invalid coupon");
            setAppliedCoupon(null);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode("");
        setCouponError("");
    };

    const handleContinue = () => {
        setStep(2);
    };

    const handleBack = () => {
        setStep(1);
    };

    const handleConfirm = () => {
        onBuy({
            productId,
            quantity,
            subtotal,
            shipping,
            discount,
            coupon: appliedCoupon ? couponCode.trim().toUpperCase() : null,
            total
        });
        closePopup(true);
    };

    // Step configuration
    const STEPS = {
        1: {
            title: "Review Order",
            icon: <MdShoppingCart />,
            primaryButton: { label: "Continue", action: handleContinue },
            secondaryButton: { label: "Cancel", action: () => closePopup(false) }
        },
        2: {
            title: "Confirm Purchase",
            icon: <MdCheckCircle />,
            primaryButton: { label: "Confirm Purchase", action: handleConfirm },
            secondaryButton: { label: "Back", action: handleBack }
        }
    };

    const currentStep = STEPS[step];

    // Reusable components
    const ProductCard = () => (
        <div style={{
            display: 'flex',
            gap: '20px',
            marginBottom: '20px'
        }}>
            <img
                src={productImage}
                alt={productName}
                style={{
                    width: '120px',
                    height: '120px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0'
                }}
            />
            <div style={{ flex: 1 }}>
                <h3 style={{
                    margin: '0 0 8px 0',
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#333'
                }}>
                    {productName}
                </h3>
                <p style={{
                    margin: '0 0 12px 0',
                    fontSize: '14px',
                    color: '#666',
                    lineHeight: '1.4'
                }}>
                    {productDescription}
                </p>
                <div style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#2e7d32'
                }}>
                    $ {productPrice.toFixed(2)}
                </div>
            </div>
        </div>
    );

    const QuantitySelector = () => (
        allowQuantityChange && (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                marginBottom: '16px'
            }}>
                <span style={{
                    fontWeight: '500',
                    color: '#555'
                }}>
                    Quantity:
                </span>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        style={{
                            width: '32px',
                            height: '32px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            backgroundColor: quantity <= 1 ? '#f5f5f5' : '#fff',
                            cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                        }}
                    >
                        <MdRemove size={18} color={quantity <= 1 ? '#ccc' : '#333'} />
                    </button>
                    <span style={{
                        minWidth: '40px',
                        textAlign: 'center',
                        fontWeight: '600',
                        fontSize: '16px'
                    }}>
                        {quantity}
                    </span>
                    <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= productStock}
                        style={{
                            width: '32px',
                            height: '32px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            backgroundColor: quantity >= productStock ? '#f5f5f5' : '#fff',
                            cursor: quantity >= productStock ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                        }}
                    >
                        <MdAdd size={18} color={quantity >= productStock ? '#ccc' : '#333'} />
                    </button>
                </div>
                <span style={{
                    marginLeft: 'auto',
                    fontSize: '13px',
                    color: '#888'
                }}>
                    {productStock - quantity} available
                </span>
            </div>
        )
    );

    const PriceSummary = ({ showFreeShippingMessage = true }) => (
        <div style={{
            padding: '16px',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            marginBottom: '16px'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
                fontSize: '14px'
            }}>
                <span>Subtotal ({quantity}x):</span>
                <span style={{ fontWeight: '500' }}>
                    $ {subtotal.toFixed(2)}
                </span>
            </div>
            {showShipping && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                    fontSize: '14px'
                }}>
                    <span>Shipping:</span>
                    <span style={{
                        fontWeight: '500',
                        color: shipping === 0 ? '#2e7d32' : '#333'
                    }}>
                        {shipping === 0 ? 'FREE' : `$ ${shipping.toFixed(2)}`}
                    </span>
                </div>
            )}
            {appliedCoupon && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                    fontSize: '14px'
                }}>
                    <span style={{ color: '#2e7d32' }}>Discount:</span>
                    <span style={{ fontWeight: '500', color: '#2e7d32' }}>
                        - $ {discount.toFixed(2)}
                    </span>
                </div>
            )}
            {showShipping && showFreeShippingMessage && subtotal < freeShippingThreshold && (
                <div style={{
                    fontSize: '12px',
                    color: '#f57c00',
                    marginBottom: '8px',
                    fontStyle: 'italic'
                }}>
                    $ {(freeShippingThreshold - subtotal).toFixed(2)} remaining for free shipping
                </div>
            )}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '12px',
                borderTop: '2px solid #ddd',
                fontSize: '18px',
                fontWeight: '700'
            }}>
                <span>Total:</span>
                <span style={{ color: '#2e7d32' }}>
                    $ {total.toFixed(2)}
                </span>
            </div>
        </div>
    );

    const PaymentMethods = () => (
        acceptedPaymentMethods.length > 0 && (
            <div style={{
                fontSize: '13px',
                color: '#666',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
            }}>
                <span style={{ fontWeight: '500' }}>Payment methods:</span>
                <span>{acceptedPaymentMethods.join(', ')}</span>
            </div>
        )
    );

    // Step rendering
    const Step1Content = () => (
        <>
            <ProductCard />
            <QuantitySelector />
            <PriceSummary />
            <PaymentMethods />
        </>
    );

    const Step2Content = () => (
        <>
            {/* Order Summary */}
            <div style={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px'
            }}>
                <h4 style={{
                    margin: '0 0 12px 0',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#333',
                    paddingBottom: '8px',
                    borderBottom: '1px solid #e0e0e0'
                }}>
                    Order Summary
                </h4>

                <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '12px'
                }}>
                    <img
                        src={productImage}
                        alt={productName}
                        style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: '6px',
                            border: '1px solid #e0e0e0'
                        }}
                    />
                    <div style={{ flex: 1 }}>
                        <div style={{
                            fontWeight: '600',
                            color: '#333',
                            marginBottom: '4px'
                        }}>
                            {productName}
                        </div>
                        <div style={{
                            fontSize: '14px',
                            color: '#666'
                        }}>
                            Quantity: {quantity}
                        </div>
                    </div>
                    <div style={{
                        fontWeight: '600',
                        color: '#2e7d32',
                        fontSize: '16px'
                    }}>
                        $ {subtotal.toFixed(2)}
                    </div>
                </div>
            </div>

            {/* Discount Coupon */}
            {allowCoupon && (
                <div style={{
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '16px'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '12px'
                    }}>
                        <MdLocalOffer style={{ fontSize: '20px' }} />
                        <span style={{ fontWeight: '600', color: '#333' }}>
                            Discount Coupon
                        </span>
                    </div>

                    {!appliedCoupon ? (
                        <div>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                <input
                                    type="text"
                                    ntpopups-css="true"
                                    placeholder="Enter coupon code"
                                    value={couponCode}
                                    autoFocus="true"
                                    onChange={(e) => {
                                        setCouponCode(e.target.value.toUpperCase());
                                        setCouponError("");
                                    }}
                                    onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                                    style={{
                                        flex: 1,
                                        padding: '10px 12px',
                                        border: `1px solid ${couponError ? '#d32f2f' : '#ddd'}`,
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        outline: 'none'
                                    }}
                                />
                                <button
                                    onClick={handleApplyCoupon}
                                    disabled={couponLoading}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: `${couponLoading ? "#509b54ff" : "#2e7d32"}`,
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: `${couponLoading ? "not-allowed" : "pointer"}`,
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {couponLoading ? "Loading" : "Apply"}
                                </button>
                            </div>
                            {couponError && (
                                <div style={{
                                    color: '#d32f2f',
                                    fontSize: '13px',
                                    marginTop: '4px'
                                }}>
                                    {couponError}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px',
                            backgroundColor: '#e8f5e9',
                            borderRadius: '6px'
                        }}>
                            <div>
                                <div style={{ fontWeight: '600', color: '#2e7d32', marginBottom: '4px' }}>
                                    {couponCode.toUpperCase()}
                                </div>
                                <div style={{ fontSize: '13px', color: '#558b2f' }}>
                                    {appliedCoupon.type === 'percent'
                                        ? `${appliedCoupon.discount}% discount`
                                        : `$ ${appliedCoupon.discount.toFixed(2)} discount`}
                                </div>
                            </div>
                            <button
                                onClick={handleRemoveCoupon}
                                style={{
                                    padding: '6px 12px',
                                    backgroundColor: 'transparent',
                                    color: '#d32f2f',
                                    border: '1px solid #d32f2f',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    fontWeight: '500'
                                }}
                            >
                                Remove
                            </button>
                        </div>
                    )}
                </div>
            )}
            <PriceSummary showFreeShippingMessage={false} />
        </>
    );

    const STEP_CONTENT = {
        1: <div><Step1Content /></div>,
        2: <div style={{ width: "min(500px, 80vw)", minWidth: "100%" }}><Step2Content /></div>
    };

    return (
        <>
            <header className={popupstyles.header}>
                <div className={popupstyles.icon}>
                    {currentStep.icon}
                </div>
                {currentStep.title}
            </header>

            <section className={popupstyles.body}>
                {STEP_CONTENT[step]}
            </section>

            <footer className={popupstyles.footer}>
                <button
                    className={popupstyles.baseButton}
                    base-button-style={"2"}
                    base-button-no-flex={"true"}
                    onClick={currentStep.secondaryButton.action}
                    style={{
                        padding: '12px 24px'
                    }}
                >
                    <span>{currentStep.secondaryButton.label}</span>
                </button>
                <button
                    autoFocus={true}
                    className={popupstyles.baseButton}
                    base-button-style={"3"}
                    base-button-no-flex={"true"}
                    onClick={currentStep.primaryButton.action}
                    style={{
                        padding: '12px 24px'
                    }}
                >
                    <span>{currentStep.primaryButton.label}</span>
                </button>
            </footer>
        </>
    );
}