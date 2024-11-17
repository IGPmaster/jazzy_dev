<template>
    <!-- Fixed Header -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-jazzy-blue border-b border-white/10">
        <div class="container mx-auto px-4">
            <div class="flex items-center justify-between h-[60px] md:h-[80px]">
                <!-- Logo -->
                <div class="flex-shrink-0">
                    <img src="/images/JazzySpins_logo_wh.svg" alt="JazzySpins" class="h-8 md:h-12 w-auto" />
                </div>

                <!-- Right Side CTAs -->
                <div class="flex items-center gap-2 md:gap-4">
                    <button @click="() => window.location.href = loginLink"
                        class="px-4 py-1 md:px-6 md:py-2 bg-jazzy-green text-white font-medium rounded-md hover:bg-opacity-90 transition-all duration-300 uppercase tracking-wide text-xs md:text-sm">
                        {{ msgTranslate.login }}
                    </button>

                    <button @click="() => window.location.href = regLink"
                        class="px-4 py-1 md:px-6 md:py-2 bg-jazzy-red-secondary text-white font-medium rounded-md hover:bg-jazzy-red hover:scale-105 transition-all duration-300 uppercase tracking-wide text-xs md:text-sm">
                        {{ msgTranslate.sign_up }}
                    </button>
                </div>
            </div>
        </div>
    </header>


    <!-- Main Content (adjust the top margin to account for fixed header) -->
    <div class="min-h-screen bg-jazzy-blue">
        <!-- Hero Section -->
        <div class="relative h-[600px] md:h-[500px] overflow-hidden pt-[80px]">
            <!-- Background Image for Mobile and Desktop -->
            <div class="absolute inset-0 mt-16">
                <img src="/images/jazz-mobile-welcome-notext.webp" alt="Casino Atmosphere"
                    class="w-full h-full object-cover object-top md:hidden" />
                <img src="/images/jazz-desktop-welcome.webp" alt="Casino Atmosphere"
                    class="w-full h-full object-cover object-top hidden md:block" />
                <div class="absolute inset-0 bg-gradient-to-r from-jazzy-darkblue/80 to-transparent md:block"></div>
            </div>

            <!-- Animated Content -->
            <div
                class="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-5 md:justify-center md:pb-0">
                <div class="space-y-4 max-w-xs md:max-w-2xl animate-fade-in text-center md:text-left mx-auto md:mx-0">
                    <div class="space-y-1 md:space-y-2">
                        <!-- Text with Responsive Alignment -->
                        <h1
                            class="text-base mb-0 md:text-2xl font-normal text-white animate-slide-up tracking-wider uppercase">
                            REGISTER AND DEPOSIT TO GET
                        </h1>

                        <div
                            class="flex flex-col md:flex-row items-center md:items-baseline gap-1 md:gap-4 animate-slide-up animation-delay-200">
                            <span class="text-2xl md:text-5xl font-semibold italic text-white font-inter">
                                200% BONUS UP TO £100
                            </span>
                        </div>

                        <div
                            class="flex flex-row items-center md:items-baseline gap-1 md:gap-4 justify-center md:justify-start mx-auto">
                            <span class="text-3xl md:text-7xl font-semibold text-white font-oswald">PLUS</span>
                            <span class="text-3xl md:text-7xl font-semibold text-jazzy-yellow font-oswald">50 FREE
                                SPINS</span>
                        </div>


                        <div
                            class="text-xl md:text-4xl font-normal text-jazzy-red uppercase animate-slide-up animation-delay-400 font-inter">
                            ON THE PAYING PIANO CLUB
                        </div>
                    </div>

                    <!-- Centered Button on Mobile, Left-Aligned on Desktop -->
                    <button
                        class="mt-4 md:mt-8 px-6 py-3 md:px-8 md:py-4 bg-jazzy-red-secondary hover:bg-jazzy-red text-white text-lg md:text-xl font-normal font-oswald rounded-lg transform hover:scale-105 transition-all animate-slide-up animation-delay-600">
                        JOIN NOW
                    </button>

                    <!-- Payment Methods Pills Section, Responsive Layout -->
                    <div class="mt-6 md:mt-12 animate-slide-up animation-delay-800">
                        <div
                            class="flex flex-wrap items-center gap-1 justify-center md:justify-start max-w-[300px] md:max-w-[800px]">
                            <div v-for="n in 10" :key="n"
                                class="flex-shrink-0 h-[20px] md:h-[30px] transform hover:scale-110 transition-all duration-300">
                                <img :src="`/images/paypills/paypills_${String(n).padStart(2, '0')}.png`"
                                    :alt="`Payment Method ${n}`" class="w-auto h-5 md:h-6 object-contain" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Steps Section -->
        <div class="bg-jazzy-beige py-8">
            <div class="container mx-auto px-4">
                <div class="flex justify-center items-center gap-4 mx-auto">
                    <img class="center" src="/images/1-2-3_JAZZY.svg" />
                </div>
            </div>
        </div>

        <!-- Features Section with 4 Yellow Icons -->
        <div class="bg-jazzy-darkblue py-16">
            <div class="container mx-auto px-4">
                <div class="flex justify-center items-center gap-4 mx-auto">
                    <img class="center" src="/images/Trust_jazzy.svg" />
                </div>
            </div>
        </div>

        <!-- Payments Section -->
        <div class="bg-jazzy-beige py-8">
            <div class="container mx-auto px-4">
                <div class="flex justify-center items-center gap-4 mx-auto">
                    <img class="center" src="/images/payments_jazzy.svg" />
                </div>
            </div>
        </div>

        <!-- Game Providers Section -->
        <div class="bg-jazzy-liteblue py-10 overflow-hidden relative">
            <div class="slider">
                <div class="slide-track">
                    <!-- First set of logos -->
                    <div v-for="provider in providers" :key="`logo-${provider.id}`"
                        class="slide flex-shrink-0 w-48 h-24 rounded-lg flex items-center justify-center transform hover:scale-105 transition-all duration-300 mx-4">
                        <img :src="provider.path" :alt="`Provider ${provider.id}`"
                            class="w-36 h-16 object-contain transition-all duration-300" />
                    </div>

                    <!-- Duplicate set for seamless loop -->
                    <div v-for="provider in duplicateProviders" :key="`logo-dup-${provider.id}`"
                        class="slide hidden flex-shrink-0 w-48 h-24 bg-white/10 rounded-lg flex items-center justify-center transform hover:scale-105 transition-all duration-300 mx-4">
                        <img :src="provider.path" :alt="`Provider ${provider.id}`"
                            class="w-36 h-16 object-contain transition-all duration-300" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Terms Section -->
        <div class="bg-jazzy-blue py-16">
            <div class="container mx-auto px-4">
                <div class="prose prose-lg max-w-4xl mx-auto">
                    <p v-for="n in 1" :key="n" class="text-jazzy-beige mb-4 font-thin">

                    <p class="text-3xl font-normal pt-4">Terms and Conditions</p>
                    Players must make a minimum deposit of £10.
                    Bonus or any winnings from the free spins must be wagered 50 times before a withdrawal may be made.
                    Wagering contributions apply and vary from game to game.
                    Withdrawal requests void all active/pending bonuses.
                    In order to qualify for the bonus, the player must deposit using the casino cashier only.

                    <p class="text-2xl font-normal pt-4">Match Deposit Offer:</p>
                    Any bonus and winnings will expire 30 days after being credited from the date and time it is
                    credited to a player's account. Players who have not used their bonus and winnings generated
                    from the bonus or if the Wagering Requirement has not been met within the stipulated time limits
                    shall not be able to receive the expired bonus and/or winnings generated from the bonus
                    thereafter.
                    Once the amount you have wagered meets or exceeds the Wagering Requirement, the Promotion will end
                    and your Bonus Funds will automatically transfer to your Real Money Balance (up to the
                    Maximum Conversion Amount of 3 times the original bonus amount credited to your account) from where
                    you will be able to withdraw them as cash or continue to use them in non-Promotion play.

                    <p class="text-2xl font-normal pt-4">Free Spins Offer:</p>
                    Any bonus and winnings will expire 7 days after being credited from the date and time it is
                    credited to a player's account. Players who have not used their bonus and winnings generated
                    from the bonus or if the Wagering Requirement has not been met within the stipulated time limits
                    shall not be able to receive the expired bonus and/or winnings generated from the bonus
                    thereafter.
                    Once the amount you have wagered meets or exceeds the Wagering Requirement, the Promotion will
                    end and your Bonus Funds will automatically transfer to your Real Money Balance (up to the
                    Maximum Conversion Amount of £20) from where you will be able to withdraw them as cash or
                    continue to use them in non-Promotion play.

                    <p class="text-2xl font-normal pt-4">General Terms & Conditions:</p>
                    The promotion is not available to customers depositing with Skrill and Neteller payment method.
                    All active bonuses or pending bonuses and promotional offers, and any winnings generated through
                    the wagering of either of the aforementioned, will be cancelled upon withdrawal request if any
                    of the applicable conditions have not been met in full prior to withdrawal request being
                    submitted.
                    The promotion is subject to the JazzySpins's Terms and Conditions.
                    JazzySpins reserves the right to alter this chapter, cancel, modify or suspend any offer and any
                    promotion at any time and without prior notice – in respect of any Bonus that has yet to be
                    provided to You. Any bonuses granted prior to the change shall not be affected. The terms and
                    conditions and the bonus policy that apply to any Bonus received by You are the Terms and
                    Conditions and its Bonus Policy that are in force at the time in which You sign up to the
                    Promotion to which that Bonus relates. Nothing in this section limits any other right and/or
                    remedy granted to Us.
                    These terms and conditions may be published in a number of languages for information purposes.
                    In case of deviations, the English version applies.
                    </p>
                </div>
            </div>
        </div>
        <Footer />
    </div>
</template>

<script setup>
definePageMeta({
    layout: false
})
import { ref } from 'vue'

const steps = [
    { number: '1', title: 'REGISTER', description: 'Sign up in seconds' },
    { number: '2', title: 'DEPOSIT', description: '£20 or more' },
    { number: '3', title: 'GET BONUS', description: 'Start playing instantly' }
]

// Update features data
const features = [
    { title: 'Huge Games Collection', icon: 'games' },
    { title: 'Safe & Secure', icon: 'shield' },
    { title: 'Fast Withdrawals', icon: 'money' },
    { title: '24/7 Support', icon: 'support' }
]

// Generate array of image paths
const providers = Array.from({ length: 29 }, (_, i) => ({
    id: i + 1,
    path: `/images/providers/providers_${String(i + 1).padStart(2, '0')}.png`
}));

// Duplicate the array for seamless loop
const duplicateProviders = [...providers];

// Add SEO meta tags
useHead({
  title: '200% Welcome Bonus up to £100 + 50 Free Spins | Jazzy Spins Casino',
  meta: [
    { 
      name: 'description', 
      content: 'Join Jazzy Spins Casino today and claim your 200% welcome bonus up to £100 plus 50 free spins on The Paying Piano Club. New players only, minimum deposit £10.'
    },
    {
      name: 'keywords',
      content: 'casino welcome bonus, casino free spins, online casino bonus, Jazzy Spins bonus, casino sign up offer, casino welcome package'
    },
    // Open Graph tags for social sharing
    {
      property: 'og:title',
      content: '200% Welcome Bonus up to £100 + 50 Free Spins | Jazzy Spins Casino'
    },
    {
      property: 'og:description',
      content: 'Join Jazzy Spins Casino today and claim your 200% welcome bonus up to £100 plus 50 free spins on The Paying Piano Club. New players only, minimum deposit £10.'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    // Add canonical URL to prevent duplicate content issues
    {
      rel: 'canonical',
      href: 'https://jazzyspins.com/promotion/campaign1'
    }
  ]
});
</script>

<style scoped>
/* Keep your existing styles */
.glow-effect {
    text-shadow: 0 0 20px rgba(254, 183, 8, 0.5);
}

.animate-fade-in {
    animation: fadeIn 1s ease-out forwards;
}

.animate-slide-up {
    animation: slideUp 0.8s ease-out forwards;
}

.animation-delay-200 {
    animation-delay: 200ms;
}

.animation-delay-400 {
    animation-delay: 400ms;
}

.animation-delay-600 {
    animation-delay: 600ms;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Add these new styles for the slider */
.slider {
    position: relative;
    width: 100%;
    overflow: hidden;
}

.slide-track {
    display: flex;
    width: calc(192px * 12);
    /* Width of each slide (including margin) * total number of slides */
    animation: scroll 20s linear infinite;
}

.slide {
    flex-shrink: 0;
}

@keyframes scroll {
    0% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(calc(-192px * 6));
        /* Width of each slide * number of unique slides */
    }
}
.step-container {
    position: relative;
    display: flex;
    align-items: center;
}

@media (max-width: 768px) {
    .step-container::after {
        content: '';
        position: absolute;
        bottom: -20px;
        left: 50%;
        transform: translateX(-50%);
        width: 2px;
        height: 20px;
        background-color: #DD0524;
    }
}
/* Optional: Pause on hover */
.slide-track:hover {
    animation-play-state: paused;
}
/* Payment pills specific styles */
.grid-cols-5 {
    grid-template-columns: repeat(5, minmax(0, 1fr));
}

@media (min-width: 768px) {
    .grid-cols-10 {
        grid-template-columns: repeat(10, minmax(0, 1fr));
    }
}

/* Optional: Add fade in/out edges on mobile */
@media (max-width: 767px) {
    .grid::before,
    .grid::after {
        content: '';
        position: absolute;
        width: 2rem;
        height: 100%;
        z-index: 1;
    }

    .grid::before {
        left: 0;
        background: linear-gradient(to right, var(--jazzy-blue), transparent);
    }

    .grid::after {
        right: 0;
        background: linear-gradient(to left, var(--jazzy-blue), transparent);
    }
}

/* Optional: Add subtle hover effect for payment pills */
.bg-white\/10:hover {
    background-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
}
</style>