import { DivContainer, DivTitle, DivLinks, Title, Link} from './style';
import React from "react";

function Home() {
    return (
            <DivContainer>
                <DivTitle>
                    <Title>chronos web</Title>
                </DivTitle>
                <DivLinks>
                    <Link href='/cronometro'>Cronômetro</Link>
                    <Link href='/sorteio'>Sorteios</Link>
                    <Link href='/classificacao'>Ranking</Link>
                    <Link href='/equipes'>Equipes</Link>
                    <Link href='/sumo'>Sumô</Link>
                </DivLinks>
            </DivContainer>
    )
}

export default Home;