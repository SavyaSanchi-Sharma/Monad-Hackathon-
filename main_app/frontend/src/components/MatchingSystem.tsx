import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { ProfileMatcher } from 'monad-hackathon';
import ProfileMatcherABI from '../contracts/ProfileMatcher.json';

export default function MatchingSystem() {
    const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
    const [contract, setContract] = useState<ethers.Contract | null>(null);
    const [aiMatcher, setAiMatcher] = useState<ProfileMatcher | null>(null);

    useEffect(() => {
        const init = async () => {
            // Initialize Web3
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                
                const contractAddress = "YOUR_CONTRACT_ADDRESS";
                const profileMatcher = new ethers.Contract(
                    contractAddress,
                    ProfileMatcherABI,
                    signer
                );

                setProvider(provider);
                setContract(profileMatcher);

                // Initialize WASM
                const matcher = new ProfileMatcher(JSON.stringify(yourProfile));
                setAiMatcher(matcher);
            }
        };

        init();
    }, []);

    const handleMatch = async (otherProfile: any) => {
        try {
            // Get AI match score
            const matchResult = aiMatcher?.match_with(JSON.stringify(otherProfile));
            const score = matchResult?.score() || 0;

            // Record on blockchain
            if (contract && score > 0) {
                const tx = await contract.recordMatch(
                    yourAddress,
                    otherProfile.address,
                    Math.floor(score * 100) // Convert to integer
                );
                await tx.wait();
            }

            return score;
        } catch (error) {
            console.error('Matching error:', error);
            return 0;
        }
    };

    return (
        <div>
            {/* Your UI components */}
        </div>
    );
}