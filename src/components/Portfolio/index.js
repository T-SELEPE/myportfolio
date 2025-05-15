import React, { useEffect, useState } from "react";
import Loader from "react-loaders";
import AnimatedLetters from "../AnimatedLetters";
import "./index.scss";

const Portfolio = () => { 
    const [letterClass, setLetterClass] = useState('text-animate');
    const [portfolio, setPortfolio] = useState([]);
    const [showScrollIndicator, setShowScrollIndicator] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLetterClass('text-animate-hover');
        }, 3000);

        // Add scroll event listener to hide indicator on scroll
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setShowScrollIndicator(false);
            } else {
                setShowScrollIndicator(true);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('scroll', handleScroll);
        }
    }, []);

    useEffect(() => {
        // Project data
        setPortfolio([
            {
                name: "Elektrik Design System",
                subtitle: "BY Tshepo Selepe",
                description: "A Design System",
                image: "/portfolio/elektrik/cover.png",
                buttons: [
                    {
                        text: "Figma",
                        url: "https://www.figma.com/design/8JcHl9ocxUCGaZ83i1laYi/The-Elektrik-Design-System?node-id=0-1&t=LAAd2UKabJVipbkj-1"
                    },
                    {
                        text: "Storybook",
                        url: "https://electrik-design-system.vercel.app/?path=/docs/introduction--docs"
                    }
                ]
            },
            {
                name: "Rentoza E-commerce Application Redesign",
                description: "Mobile App Redesign",
                image: "/portfolio/rentoza/cover.png",
                buttons: [
                    {
                        text: "View Project",
                        url: "https://www.behance.net/gallery/224618121/Rentoza-e-commerce-Mobile-App-Redesign"
                    }
                ]
            },
            {
                name: "FNB Case Study:Horizon Liv-Unified Lifestyle App",
                description: "Case Study",
                image: "/portfolio/fnb/cover.png",
                overlayClass: "blue-overlay",
                buttons: [
                    {
                        text: "View Project",
                        url: "https://www.behance.net/gallery/221728317/FNB-Case-Study-Horizon-Liv"
                    }
                ]
            },
            {
                name: "Nintex Design System Contributions",
                description: "UI Components",
                image: "/portfolio/nintex/cover.png",
                buttons: [
                    {
                        text: "View Project",
                        url: "https://www.behance.net/gallery/221774983/UI-components-designed-developed-for-MFEs"
                    }
                ]
            },
            {
                name: "Meet CardSpace",
                description: "Your all-in-one loyalty app",
                image: "/portfolio/cardspace/cover.png",
                overlayClass: "blue-overlay",
                buttons: [
                    {
                        text: "Download on iOS",
                        url: "https://apps.apple.com/za/app/meet-cardspace/id1585628713"
                    },
                    {
                        text: "Download on Android",
                        url: "https://play.google.com/store/apps/details?id=com.meetcardspace.app&hl=en&gl=US&pli=1"
                    }
                ]
            }
        ]);
    }, []);

    const renderPortfolio = (portfolio) => {
        return (
            <div className="images-container">
                {
                    portfolio.map((port, idx) => {
                        return (
                            <div className={`image-box ${port.overlayClass || ''}`} key={idx}>
                                <img 
                                    src={port.image}
                                    className="portfolio-image"
                                    alt={port.name} />
                                <div className="content">
                                    <p className="title">{port.name}</p>
                                    {port.subtitle && <p className="subtitle">{port.subtitle}</p>}
                                    <h4 className="description">{port.description}</h4>
                                    <div className="button-container">
                                        {port.buttons && port.buttons.map((button, buttonIdx) => (
                                            <button
                                                key={buttonIdx}
                                                className="btn"
                                                onClick={() => window.open(button.url)}
                                            >{button.text}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        );
    }

    return (
        <>
            <div className="container portfolio-page">
                <h1 className="page-title">
                    <AnimatedLetters
                        letterClass={letterClass}
                        strArray={"Portfolio".split("")}
                        idx={15}
                    />
                </h1>
                <div>{renderPortfolio(portfolio)}</div>
                {showScrollIndicator && (
                    <div className="scroll-indicator">
                        <span className="scroll-text">Scroll to see more projects</span>
                        <span className="scroll-arrow">↓</span>
                    </div>
                )}
            </div>
            <Loader type="pacman" />
        </>
    );
}

export default Portfolio;