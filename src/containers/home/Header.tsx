import * as React from 'react';
import styled from 'styled-components';

import AcnLogo from '../../assets/images/Acc_GT_Solid_P1_RGB.svg';

const Container = styled.section`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: 1rem 10%;
    margin-bottom: 2rem;
`;

const TitleAndLogo = styled.div`
    display: flex;
    justify-content: space-between;
`;

const H1 = styled.h1`
    font-size: 3rem;
    line-height: 3rem;
    margin-bottom: 1rem;
`;

const H2 = styled.h2`
    font-size: 2rem;
    line-height: 2rem;
`;

const P = styled.p`
    margin: 1rem 0;
`;

const Img = styled.img`
    height: 2.5rem;
`;

const Header: React.FC<{ tp: number }> = props => {
    return (
        <Container>
            <TitleAndLogo>
                {/* This is where you can change the page title */}
                {/* --------- EDIT LINE BELOW ----------------- */}
                <H1 data-testid="h1-title">Github Actions Workshop</H1>
                {/* ------------------------------------------- */}
                <Img src={AcnLogo} />
            </TitleAndLogo>
            <P>
                GitHub Actions makes it easy to automate all your software
                workflows, now with world-class CI/CD. Build, test, and deploy
                your code right from GitHub. In this workshop you will setup
                different workflows describen in each their red box on this web
                page. Your task is to implement jobs in the worksflow which
                solves the tasks. Your changes should be pushed to the develop
                branch, this will start the workflow. If the workflow syntax is
                correct this web page will be updated with your new changes, and
                if you have implemented the correct actions to solve any of the
                tasks below they will turn green. This way you can keep track of
                your progress. The goal is to turn each box below green and
                unlock each badge. The workshop repo can be found{' '}
                <a href="https://github.com/acntech/workshop-github-actions">
                    here{' '}
                </a>
            </P>

            <P>
                Remember to use the{' '}
                <a href="https://docs.github.com/en/actions">github actions </a>
                docs, it offers good help. Hint: there are examples of how to
                setup workflows to{' '}
                <a href="https://docs.github.com/en/actions/guides/building-and-testing-nodejs-or-python">
                    test and build{' '}
                </a>{' '}
                node.js apps.
            </P>
            <H2>You have {props.tp || 0} points!</H2>
        </Container>
    );
};

export { Header };
