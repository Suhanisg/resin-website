import { useState, useEffect, useRef } from "react";
import "../styles/ProductCard.css";
import { CustomOrderForm, ThankYouCard } from "./customForm";
import {
  Flower2,
  ImageDown,
  HandFist,
  Gift,
  ReceiptText,
  Leaf,
  CalendarClock,
  HandHeart,
  Truck,
  ChevronDown,
  ClipboardList,
  Info,
  MapPin,
  Package,
  ClipboardCheck,
  Heart,
} from "lucide-react";
import { useWishlist } from "../context/WishlistContext";

const WHATSAPP_NUMBER = "919528633710";

const DEFAULT_FEATURES = [
  { icon: Flower2, label: "Real Flowers Preserved" },
  { icon: ImageDown, label: "Custom Photo Option" },
  { icon: HandFist, label: "Handmade with Love" },
  { icon: Gift, label: "A Timeless Keepsake" },
];

function ProductCard({ product }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openSection, setOpenSection] = useState(null);

  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product._id);

  // ---- custom order flow ----
  const [view, setView] = useState("details");
  const [flip, setFlip] = useState("idle");
  const [orderForm, setOrderForm] = useState({
    name: "",
    whatsapp: "",
    email: "",
    customisation: "",
    eventDate: "",
    city: "",
    instructions: "",
  });

  const [shippingInfoOpen, setShippingInfoOpen] = useState(false);
  const modalInfoRef = useRef(null);

  const selected = product.variants?.[selectedIndex];
  const features =
    product.features?.length > 0 ? product.features : DEFAULT_FEATURES;

  const galleryImages = (() => {
    const original = product.image
      ? `http://localhost:5000${product.image}`
      : null;
    const crops =
      product.images?.length > 0
        ? product.images.map((img) => `http://localhost:5000${img}`)
        : [];

    if (original) return [original, ...crops];
    return crops;
  })();

  const cardImage = galleryImages[0];

  const mainImage = galleryImages[activeImage] || cardImage;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleSection = (key) => {
    setOpenSection(openSection === key ? null : key);
  };
 const renderAccordionContent = (content) => {
  if (!content) return null;
  const parts = content
    .split("•")
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length <= 1) {
    return <p className="pc-accordion-text">{content}</p>;
  }

  return (
    <ul className="pc-accordion-list">
      {parts.map((point, i) => (
        <li key={i}>{point}</li>
      ))}
    </ul>
  );
};
  const handleWishlist = () => {
    toggleWishlist(product);
  };

  const closeModal = () => {
    setIsOpen(false);
    // reset the flow so it reopens on the details view next time
    setView("details");
    setFlip("idle");
  };

  const updateOrderField = (key, value) => {
    setOrderForm((f) => ({ ...f, [key]: value }));
  };

  // ---- book-page-flip transition between details / form / thankyou ----
  const goTo = (nextView) => {
    setFlip("leaving");
    setTimeout(() => {
      setView(nextView);
      if (modalInfoRef.current) modalInfoRef.current.scrollTop = 0; // open next view from the top
      setFlip("entering-init"); // snap to the other side instantly, no transition
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setFlip("idle")); // then animate back to flat
      });
    }, 350);
  };

  const handleCustomOrderClick = () => {
    goTo("form");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!orderForm.name || !orderForm.whatsapp || !orderForm.city) return; // basic required check
    goTo("thankyou");
  };

  const buildOrderMessage = () => {
    let message = `Hi! I want to place a custom order:\n\n*${product.name}*\n`;
    message += `Name: ${orderForm.name}\n`;
    message += `WhatsApp: ${orderForm.whatsapp}\n`;
    if (orderForm.email) message += `Email: ${orderForm.email}\n`;
    message += `Size: ${selected?.size || "-"}\n`;
    message += `Quantity: ${quantity}\n`;
    message += `Price: ₹${selected?.price || "-"}\n`;
    if (orderForm.customisation)
      message += `Customisation: ${orderForm.customisation}\n`;
    if (orderForm.eventDate) message += `Event Date: ${orderForm.eventDate}\n`;
    message += `Delivery City: ${orderForm.city}\n`;
    if (orderForm.instructions)
      message += `Special Instructions: ${orderForm.instructions}\n`;
    return message;
  };

  const handleSendWhatsApp = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildOrderMessage())}`;
    window.open(url, "_blank");
  };

  const accordionSections = [
    {
      key: "details",
      label: "Product Details",
      icon: ReceiptText,
      content: product.details,
    },
    {
      key: "material",
      label: "Material & Quality",
      icon: Leaf,
      content: product.material,
    },
    {
      key: "processing",
      label: "Processing Time",
      icon: CalendarClock,
      content: product.processingTime,
    },
    {
      key: "care",
      label: "Care Instructions",
      icon: HandHeart,
      content: product.careInstructions,
    },
    {
      key: "shipping",
      label: "Shipping Information",
      icon: Truck,
      content: product.shippingInfo,
    },
  ].filter((s) => s.content);

  return (
    <>
      <div className="pc-card">
        <div className="pc-image">
          <div className="pc-image-inner" onClick={() => setIsOpen(true)}>
            {cardImage ? (
              <img src={cardImage} alt={product.name} />
            ) : (
              <span>{product.name}</span>
            )}
          </div>
        </div>

        <div className="pc-info">
          <p className="pc-kicker">{product.category}</p>

          <h3 className="pc-name">{product.name}</h3>

          <button className="pc-cta" onClick={() => setIsOpen(true)}>
            <span>See the full vibe</span>
            <span className="pc-cta-arrow">→</span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="pc-modal-overlay" onClick={closeModal}>
          <div
            className={`pc-modal ${view === "thankyou" ? "pc-modal-thankyou-only" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="pc-modal-close" onClick={closeModal}>
              ✕
            </button>

                {view !== "thankyou" && (
            <div className="pc-modal-left">
              <div className="pc-modal-image">
                {mainImage ? (
                  <img src={mainImage} alt={product.name} />
                ) : (
                  <span>{product.name}</span>
                )}

                {/* {product.tagline && (
                  <div className="pc-image-tagline">
                    <p>{product.tagline}</p>
                    <span>♡</span>
                  </div>
                )} */}
              </div>

              {galleryImages.length > 0 && (
                <div className="pc-thumbs">
                  {galleryImages.map((img, i) => (
                    <button
                      key={i}
                      className={
                        i === activeImage ? "pc-thumb active" : "pc-thumb"
                      }
                      onClick={() => setActiveImage(i)}
                    >
                      <img src={img} alt={`${product.name} ${i + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>
            )}

            <div className="pc-modal-info" ref={modalInfoRef}>
              <div className={`pc-flip ${flip}`}>
                {view === "details" && (
                  <>
                    <p className="pc-modal-category">{product.category}</p>
                    <h2 className="pc-modal-title">{product.name}</h2>

                    {product.variants?.length > 0 && (
                      <>
                        <p className="pc-modal-label">Choose Size</p>
                        <div className="pc-size-options">
                          {product.variants.map((v, i) => (
                            <button
                              key={i}
                              type="button"
                              className={
                                i === selectedIndex
                                  ? "pc-size-swatch active"
                                  : "pc-size-swatch"
                              }
                              onClick={() => setSelectedIndex(i)}
                            >
                              {v.size}
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    <div className="pc-price-row">
                      <p className="pc-modal-price">
                        ₹{selected?.price}{" "}
                        <span className="pc-price-suffix">onwards</span>
                      </p>
                      <button
                        className="pc-wishlist-link"
                        onClick={handleWishlist}
                      >
                        {wishlisted
                          ? "♥ Wishlisted"
                          : "♡ Customisation available"}
                      </button>
                    </div>
                    <div
                      className={`pc-shipping-info ${shippingInfoOpen ? "open" : ""}`}
                    >
                      <button
                        type="button"
                        className="pc-shipping-header"
                        onClick={() => setShippingInfoOpen((v) => !v)}
                      >
                        <span className="pc-shipping-header-left">
                          {shippingInfoOpen ? (
                            <Truck size={16} className="pc-shipping-icon" />
                          ) : (
                            <Info size={16} className="pc-shipping-icon" />
                          )}
                          <span className="pc-shipping-header-text">
                            {shippingInfoOpen ? (
                              <span className="pc-shipping-title">
                                Shipping Information
                              </span>
                            ) : (
                              <>
                                <span className="pc-shipping-title">
                                  Price shown is for the product only.
                                </span>
                                <span className="pc-shipping-subtext">
                                  Shipping charges will be calculated separately
                                  based on your location.
                                </span>
                              </>
                            )}
                          </span>
                        </span>
                        <span className="pc-shipping-toggle">
                          {shippingInfoOpen ? "Know less" : "Know more"}
                          <ChevronDown
                            size={14}
                            className={
                              shippingInfoOpen
                                ? "pc-shipping-chevron open"
                                : "pc-shipping-chevron"
                            }
                          />
                        </span>
                      </button>

                      {shippingInfoOpen && (
                        <div className="pc-shipping-body">
                          <p className="pc-shipping-lead">
                            Shipping is not included in the displayed product
                            price.
                          </p>
                          <p className="pc-shipping-desc">
                            Shipping charges are calculated separately based on
                            your location, package weight and final order
                            requirements. Once your product all details are
                            finalised, we will confirm the exact shipping charge
                            with you before placing your order.
                          </p>

                          <div className="pc-shipping-grid">
                            <div className="pc-shipping-item">
                              <MapPin
                                size={20}
                                className="pc-shipping-item-icon"
                                strokeWidth={1.5}
                              />
                              <span className="pc-shipping-item-label">
                                Your Location
                              </span>
                              <span className="pc-shipping-item-sub">
                                Delivery city / pincode
                              </span>
                            </div>
                            <div className="pc-shipping-item">
                              <Package
                                size={20}
                                className="pc-shipping-item-icon"
                                strokeWidth={1.5}
                              />
                              <span className="pc-shipping-item-label">
                                Package Weight
                              </span>
                              <span className="pc-shipping-item-sub">
                                Final packed product dimensions
                              </span>
                            </div>
                            <div className="pc-shipping-item">
                              <ClipboardCheck
                                size={20}
                                className="pc-shipping-item-icon"
                                strokeWidth={1.5}
                              />
                              <span className="pc-shipping-item-label">
                                Order Requirements
                              </span>
                              <span className="pc-shipping-item-sub">
                                Packaging & any special requirements
                              </span>
                            </div>
                          </div>

                          <div className="pc-shipping-note">
                            <Heart
                              size={14}
                              className="pc-shipping-note-icon"
                              fill="currentColor"
                            />
                            <span>
                              Every order is unique, and we ensure the best and
                              most accurate shipping rate for your location and
                              requirements.
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {features.length > 0 && (
                      <div className="pc-features-row">
                        {features.map((f, i) => {
                          const Icon = f.icon;
                          return (
                            <div className="pc-feature" key={i}>
                              <Icon
                                className="pc-feature-icon"
                                size={28}
                                strokeWidth={1.3}
                              />
                              <span className="pc-feature-label">
                                {f.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {accordionSections.length > 0 && (
                      <div className="pc-accordion">
                        {accordionSections.map((s) => {
                          const Icon = s.icon;
                          return (
                            <div className="pc-accordion-item" key={s.key}>
                              <button
                                className="pc-accordion-header"
                                onClick={() => toggleSection(s.key)}
                              >
                                <span className="pc-accordion-header-label">
                                  <Icon
                                    className="pc-accordion-icon"
                                    size={18}
                                    strokeWidth={1.6}
                                  />
                                  {s.label}
                                </span>
                                <ChevronDown
                                  className={
                                    openSection === s.key
                                      ? "pc-chevron open"
                                      : "pc-chevron"
                                  }
                                  size={17}
                                  strokeWidth={2}
                                />
                              </button>
                              {openSection === s.key && (
                                <div className="pc-accordion-body">
                                  {renderAccordionContent(s.content)}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="pc-action-row">
                      <button
                        className="pc-wishlist-btn"
                        onClick={handleWishlist}
                      >
                        {wishlisted ? "♥ Wishlisted" : "♡ Add to Wishlist"}
                      </button>

                      <button
                        className="pc-custom-order-btn"
                        onClick={handleCustomOrderClick}
                      >
                        <ClipboardList size={16} strokeWidth={2} />
                        Custom Order
                      </button>
                    </div>
                  </>
                )}

                {view === "form" && (
                  <CustomOrderForm
                    product={product}
                    selectedIndex={selectedIndex}
                    setSelectedIndex={setSelectedIndex}
                    quantity={quantity}
                    setQuantity={setQuantity}
                    orderForm={orderForm}
                    updateOrderField={updateOrderField}
                    onSubmit={handleFormSubmit}
                    onBack={() => goTo("details")}
                  />
                )}

                {view === "thankyou" && (
                  <ThankYouCard
                    onSend={handleSendWhatsApp}
                    onBack={() => goTo("form")}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductCard;
