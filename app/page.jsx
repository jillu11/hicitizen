"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

// Slideshow component
function HomeSlideshow() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative h-screen w-full overflow-hidden">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                        currentSlide === index ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    {/* Image */}
                    <div className="relative h-full w-full">
                        <Image
                            src={`/images/home_slides/${slide.image}`}
                            alt={slide.alt}
                            fill
                            className="object-cover"
                            priority={index === 0}
                        />
                        {/* Dark overlay */}
                        <div className="absolute inset-0 bg-black/40" />
                    </div>

                    {/* Text content */}
                    <div className="absolute bottom-16 left-8 md:left-16 max-w-xl text-white p-6 rounded-lg bg-black/30 backdrop-blur-sm">
                        <h2 className="text-2xl md:text-4xl font-bold mb-3">
                            {slide.title}
                        </h2>
                        <p className="text-lg md:text-xl">
                            {slide.description}
                        </p>
                    </div>

                    {/* Navigation dots */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentSlide(i)}
                                className={`w-3 h-3 rounded-full transition-colors ${
                                    currentSlide === i ? 'bg-white' : 'bg-white/50'
                                }`}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

// Add this new Slideshow component
function ImageSlideshow({ images, currentIndex, onClose }) {
    const [activeIndex, setActiveIndex] = useState(currentIndex);

    const nextSlide = () => {
        setActiveIndex((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
                aria-label="Close slideshow"
            >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Navigation buttons */}
            <button
                onClick={prevSlide}
                className="absolute left-4 text-white hover:text-gray-300 z-50"
                aria-label="Previous image"
            >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 text-white hover:text-gray-300 z-50"
                aria-label="Next image"
            >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Image container */}
            <div className="relative w-full h-full max-w-4xl max-h-[80vh] mx-auto">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-300 ${
                            index === activeIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                    >
                        <div className="relative w-full h-full flex items-center justify-center p-4">
                            <Image
                                src={`/images/gallery/${image.src}`}
                                alt={image.alt}
                                fill
                                className="object-contain"
                                sizes="(max-width: 1536px) 100vw, 1536px"
                            />
                            {/* Caption */}
                            <div className="absolute bottom-4 left-0 right-0 text-center text-white bg-black/50 p-4">
                                <h3 className="text-lg font-semibold">{image.title}</h3>
                                <p className="text-sm">{image.caption}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Update the Gallery component
function Gallery() {
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryImages.map((image, index) => (
                    <div
                        key={index}
                        className="relative aspect-square cursor-pointer group overflow-hidden"
                        onClick={() => setSelectedImage(index)}
                    >
                        <Image
                            src={`/images/gallery/${image.src}`}
                            alt={image.alt}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="text-white text-center p-4">
                                <h3 className="text-lg font-semibold">{image.title}</h3>
                                <p className="text-sm">{image.caption}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Slideshow Modal */}
            {selectedImage !== null && (
                <ImageSlideshow
                    images={galleryImages}
                    currentIndex={selectedImage}
                    onClose={() => setSelectedImage(null)}
                />
            )}
        </>
    );
}

export default function Page() {
    return (
        <main className="flex flex-col">
            {/* Hero Section with Slideshow */}
            <section id="home" className="relative">
                <HomeSlideshow />
            </section>

            {/* Updates Section */}
            <div className="bg-blue-50 py-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-4">
                        <span className="font-bold whitespace-nowrap">Latest Updates:</span>
                        <div className="overflow-hidden">
                            <div className="animate-marquee whitespace-nowrap">
                                New IELTS Batch Starting June 1st | Spoken English Weekend Classes | Special Corporate Training Programs
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* About Section */}
            <section id="about" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-3xl font-bold text-indigo-900 mb-4">Welcome to HiCitizen</h2>
                            <p className="text-gray-600 space-y-4">
                                <span className="block">HiCitizen Academy is your gateway to English language excellence. We specialize in transforming learners into confident English communicators through our innovative teaching methods and personalized approach.</span>
                                <span className="block">With over 5 years of experience and 1000+ success stories, we've established ourselves as a leading English language training institute.</span>
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            {features.map((feature, index) => (
                                <div key={index} className="text-center p-6 bg-indigo-50 rounded-lg hover:shadow-lg transition-shadow">
                                    <div className="text-4xl mb-4 text-indigo-600">{feature.icon}</div>
                                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                    <p className="text-sm text-gray-600">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Courses Section */}
            <section id="features" className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Our Programs</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {courses.map((course, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                                <div className="text-3xl mb-4 text-indigo-600">{course.icon}</div>
                                <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                                <p className="text-gray-600 mb-4">{course.description}</p>
                                <div className="text-indigo-600 font-semibold">{course.duration}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section id="why-choose-us" className="py-16 bg-indigo-900 text-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Why Choose HiCitizen?</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {reasons.map((reason, index) => (
                            <div key={index} className="bg-indigo-800/50 p-6 rounded-lg">
                                <div className="flex items-start gap-4">
                                    <span className="text-xl">✓</span>
                                    <p>{reason}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Success Stories / Testimonials */}
            <section id="testimonials" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Success Stories</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {successStories.map((story, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
                                {/* YouTube Embed */}
                                <div className="relative w-full pt-[56.25%]"> {/* 16:9 Aspect Ratio */}
                                    <iframe
                                        className="absolute top-0 left-0 w-full h-full"
                                        src={`https://www.youtube.com/embed/${story.videoId}`}
                                        title={story.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                                {/* Video Info */}
                                <div className="p-4">
                                    <h3 className="font-bold text-lg mb-2">{story.title}</h3>
                                    <p className="text-gray-600 text-sm">{story.description}</p>
                                    <div className="mt-2 text-sm text-indigo-600 font-semibold">
                                        {story.achievement}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section id="gallery" className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Our Gallery</h2>
                    <Gallery />
                </div>
            </section>
        </main>
    );
}

// Slide data
const slides = [
    {
        id: 1,
        image: 'slide1.jpg',
        alt: 'Students engaged in group discussion',
        title: 'Learn English with Confidence',
        description: 'Join our interactive classes and master English communication'
    },
    {
        id: 2,
        image: 'slide2.jpg',
        alt: 'Professional training session',
        title: 'Professional English Training',
        description: 'Specialized courses for career advancement and global opportunities'
    },
    {
        id: 3,
        image: 'slide3.jpg',
        alt: 'Student receiving individual attention',
        title: 'Personalized Learning Experience',
        description: 'Get individual attention and customized learning plans'
    }
];

const features = [
    {
        icon: "👥",
        title: "Small Batches",
        description: "Maximum attention with limited students per batch"
    },
    {
        icon: "🎯",
        title: "Focused Learning",
        description: "Structured curriculum for rapid improvement"
    },
    {
        icon: "🌟",
        title: "Expert Teachers",
        description: "Native-level trainers with proven experience"
    },
    {
        icon: "💡",
        title: "Practice Sessions",
        description: "Regular speaking and writing practice"
    }
];

const courses = [
    {
        icon: "🗣️",
        title: "Spoken English",
        description: "Master daily conversations and build confidence in speaking",
        duration: "3 months"
    },
    {
        icon: "🎯",
        title: "IELTS Preparation",
        description: "Comprehensive training for band 7+ in IELTS",
        duration: "2 months"
    },
    {
        icon: "💼",
        title: "Business English",
        description: "Professional communication skills for career growth",
        duration: "3 months"
    }
];

const reasons = [
    "Experienced trainers with international teaching certifications",
    "Flexible batch timings including weekends and evening classes",
    "Modern teaching methodology with practical approach",
    "Regular assessments and progress tracking",
    "Free speaking club membership for all students",
    "Placement assistance and corporate training programs"
];

const successStories = [
    {
        videoId: "yDO4621T-vY", // Replace with actual YouTube video IDs
        title: "From Beginner to Fluent Speaker",
        description: "Watch how Priya transformed her English speaking skills in just 3 months",
        achievement: "IELTS Band 7.5"
    },
    {
        videoId: "7-bag7nGP0E",
        title: "Corporate Success Story",
        description: "Rahul shares his journey of overcoming communication barriers at work",
        achievement: "Promoted to Team Lead"
    },
    {
        videoId: "hOgVAYpHPCc",
        title: "International Study Dreams",
        description: "Anita's journey to achieving her dream university admission",
        achievement: "Secured University Admission in Canada"
    }
];

const galleryImages = [
    {
        src: 'gallery-1.jpg',
        alt: 'English learning session',
        title: 'Interactive Learning',
        caption: 'Students engaged in dynamic group discussions'
    },
    {
        src: 'gallery-2.jpg',
        alt: 'IELTS preparation class',
        title: 'IELTS Training',
        caption: 'Focused exam preparation sessions'
    },
    {
        src: 'gallery-3.jpg',
        alt: 'Speaking practice session',
        title: 'Speaking Practice',
        caption: 'Building conversation confidence'
    },
    {
        src: 'gallery-4.jpg',
        alt: 'Business English workshop',
        title: 'Professional Development',
        caption: 'Corporate communication training'
    },
    {
        src: 'gallery-5.jpg',
        alt: 'Student presentation',
        title: 'Public Speaking',
        caption: 'Developing presentation skills'
    },
    {
        src: 'gallery-6.jpg',
        alt: 'Group activity',
        title: 'Team Activities',
        caption: 'Collaborative learning exercises'
    },
    {
        src: 'gallery-7.jpg',
        alt: 'Writing workshop',
        title: 'Writing Skills',
        caption: 'Advanced writing workshops'
    },
    {
        src: 'gallery-8.jpg',
        alt: 'Student celebration',
        title: 'Achievement Day',
        caption: 'Celebrating student success'
    },
    {
        src: 'gallery-9.jpg',
        alt: 'Grammar session',
        title: 'Grammar Mastery',
        caption: 'Interactive grammar lessons'
    },
    {
        src: 'gallery-10.jpg',
        alt: 'Cultural exchange',
        title: 'Cultural Exchange',
        caption: 'International language exposure'
    },
    {
        src: 'gallery-11.jpg',
        alt: 'Mock interview',
        title: 'Interview Preparation',
        caption: 'Professional interview training'
    },
    {
        src: 'gallery-12.jpg',
        alt: 'Pronunciation class',
        title: 'Pronunciation Workshop',
        caption: 'Accent improvement sessions'
    },
    {
        src: 'gallery-13.jpg',
        alt: 'Group discussion',
        title: 'Group Discussions',
        caption: 'Building communication skills'
    },
    {
        src: 'gallery-14.jpg',
        alt: 'Certificate ceremony',
        title: 'Graduation Day',
        caption: 'Course completion ceremony'
    }
];

const navItems = [
    // ... existing items ...
    { id: 'gallery', label: 'Gallery' },
    // ... other items ...
];
