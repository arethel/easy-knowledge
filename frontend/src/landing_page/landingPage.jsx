import "./style.css";
import { useNavigate } from "react-router-dom";
import { Section } from "./components/section/section.jsx";
import { Box } from "./components/box/box.jsx";
import { Text } from "./components/text/text.jsx";
import { Link } from "./components/link/link.jsx";
import { Image } from "./components/image/image.jsx";
import { ReactComponent as LogoEK } from '../images/logo.svg';
import { IoIosCheckmarkCircle } from "react-icons/io";
import { Icon } from "./components/icon/icon.jsx";
import { Span } from "./components/span/span.jsx";

export const LandingPage = () => {
	
	const navigate = useNavigate();
	
	const onGetStartedClick = () => {
		navigate('/main');
	}
	
    return (
        <div>
            <Section
                padding="112px 0 0px 0"
                background="var(--color-darkL2)"
                md_padding="96px 0 0px 0"
				sm_padding="72px 0 0px 0"
				flex_direction='column'
            >
                <Box
				display="flex"
				width="100%"
				flex_direction="column"
				justify_content="center"
				align_items="center"
				lg_width="100%"
				lg_align-items="center"
				lg_margin="0px 0px 60px 0px"
				sm_margin="0px 0px 40px 0px"
				margin="0px 0px 40px 0px"
				padding="0px 0px 0px 0px"
				sm_padding="0px 0px 0px 0px"
                >
                    <Box
					min_width="100%"
					min_height="100px"
					display="flex"
					align_self="center"
					align_items="center"
					justify_content="center"
				>
					<Text
						margin="0px 0px 24px 0px"
						color="var(--color-light)"
						font="--headline1"
						lg_text_align="center"
						sm_font="normal 700 42px/1.2 &quot;Source Sans Pro&quot;, sans-serif"
						text_align="center"
						md_font="normal 700 42px/1.2 &quot;Source Sans Pro&quot;, sans-serif"
						sm_width="100%"
						display="flex"
						align_content="center"
						padding="10px 30px 0px 0px"
					>
						Easy Knowledge
                        </Text>
                        <LogoEK
                            display="flex"
                            height="100px"
                            width="100px"
                            sizes="(max-width: 576px) 100vw,(max-width: 768px) 100vw,(max-width: 992px) 100vw,100vw"
                        />
				</Box>
				<Text
					margin="0px 0px 32px 0px"
					color="#FFFFFF"
					font="--lead"
					lg_text_align="center"
					text_align="center"
					width="60%"
				>
					Increase your learning speed using artificial intelligence.
				</Text>
				<Link
					href="#"
					padding="12px 24px 12px 24px"
					color="var(--color-dark)"
					background="var(--color-secondary)"
					text_decoration_line="initial"
					font="--lead"
					border_radius="8px"
					margin="0px 0px 0px 0px"
					sm_margin="0px 0px 0px 0px"
					sm_text_align="center"
					hover_transition="background-color 0.2s linear 0s"
					hover_background="var(--color-orange)"
					transition="background-color 0.2s linear 0s"
					onClick={onGetStartedClick}
				>
					Get Started
				</Link>
                </Box>
			</Section>
			<Section padding="80px 10% 80px 10%" sm_padding="60px 10% 60px 10%" flex_direction="row" flex_wrap="wrap" >
			<Box
				display="flex"
				width="50%"
				flex_direction="column"
				justify_content="flex-start"
				align_items="flex-start"
				lg_width="100%"
				lg_align_items="flex-start"
				lg_margin="0px 0px 60px 0px"
				sm_margin="0px 0px 40px 0px"
				sm_padding="0px 0px 0px 0px"
				padding="24px 0px 16px 0px"
				lg_flex_direction="row"
				lg_flex_wrap="wrap"
				>
					
				<Text
					margin="0px 0px 24px 0px"
					color="var(--color-dark)"
					font="--headline1"
					lg_text_align="center"
					sm_font="normal 700 42px/1.2 &quot;Source Sans Pro&quot;, sans-serif"
					lg_width="100%"
				>
						Add any book.<br />
						AI will do the rest.
				</Text>
				<Text
					margin="0px 0px 48px 0px"
					color="var(--color-greyD3)"
					font="--lead"
					lg_text_align="center"
					lg_width="100%"
				>
					With Easy Knowledge you can highlight any necessary information.
					<br />
					AI will help you to remember it.{" "}
				</Text>
				<Box
					display="flex"
					align_items="flex-start"
					margin="0px 0px 32px 0px"
					lg_width="50%"
					lg_margin="0px 0px 0px 0px"
					lg_padding="0px 16px 0px 0px"
					md_width="100%"
					md_margin="0px 0px 32px 0px"
					md_padding="0px 0px 0px 0px"
				>
					<Text
						padding="7px 24px 8px 24px"
						margin="0px 0px 0px 0px"
						font="--headline3"
						background="var(--color-orange)"
						border_radius="50px"
						align_items="center"
						display="flex"
						justify_content="center"
						color="var(--color-light)"
						width="49px"
						height="49px"
					>
						1
					</Text>
					<Box margin="0px 0px 0px 22px">
						<Text margin="0px 0px 8px 0px" color="var(--color-darkL2)" font="--headline3" lg-text-align="left">
							Highlight necessary info
						</Text>
						<Text margin="0px 0px 0px 0px" color="var(--color-greyD3)" font="--base" lg-text-align="left">
							App will save it and you will be able to see it whenever you want.
						</Text>
					</Box>
				</Box>
				<Box
					display="flex"
					align-items="flex-start"
					lg_width="50%"
					lg_padding="0px 0px 0px 16px"
					md_width="100%"
					md_padding="0px 0px 0px 0px"
				>
					<Text
						padding="7px 24px 8px 24px"
						margin="0px 0px 0px 0px"
						font="--headline3"
						background="var(--color-orange)"
						border_radius="50px"
						display="flex"
						align_items="center"
						justify_content="center"
						color="var(--color-light)"
						width="49px"
						height="49px"
					>
						2
					</Text>
					<Box margin="0px 0px 0px 22px">
						<Text margin="0px 0px 8px 0px" color="var(--color-darkL2)" font="--headline3" lg-text-align="left">
							Create test based on your highlights
						</Text>
						<Text margin="0px 0px 0px 0px" color="var(--color-greyD3)" font="--base" lg-text-align="left">
							AI will create you the test based on your highlights in books.
						</Text>
					</Box>
				</Box>
			</Box>
			<Box
				display="flex"
				width="50%"
				justify_content="flex-end"
				overflow_y="hidden"
				overflow_x="hidden"
				lg_width="100%"
				padding="0px 0px 0px 16px"
				align_items="center"
				lg_justify_content="center"
				lg_padding="0px 0px 0px 0px"
			>
				<Image
					src="https://uploads.quarkly.io/612695d67f2b1f001fa06c1f/images/phone22.png?v=2021-08-26T11:41:54.452Z"
					max-width="100%"
					transform="translateY(10px)"
					transition="transform 0.5s ease-in-out 0s"
					hover-transform="translateY(0px)"
					srcSet="https://smartuploads.quarkly.io/612695d67f2b1f001fa06c1f/images/phone22.png?v=2021-08-26T11%3A41%3A54.452Z&quality=85&w=500 500w,https://smartuploads.quarkly.io/612695d67f2b1f001fa06c1f/images/phone22.png?v=2021-08-26T11%3A41%3A54.452Z&quality=85&w=800 800w,https://smartuploads.quarkly.io/612695d67f2b1f001fa06c1f/images/phone22.png?v=2021-08-26T11%3A41%3A54.452Z&quality=85&w=1080 1080w,https://smartuploads.quarkly.io/612695d67f2b1f001fa06c1f/images/phone22.png?v=2021-08-26T11%3A41%3A54.452Z&quality=85&w=1600 1600w,https://smartuploads.quarkly.io/612695d67f2b1f001fa06c1f/images/phone22.png?v=2021-08-26T11%3A41%3A54.452Z&quality=85&w=2000 2000w,https://smartuploads.quarkly.io/612695d67f2b1f001fa06c1f/images/phone22.png?v=2021-08-26T11%3A41%3A54.452Z&quality=85&w=2600 2600w,https://smartuploads.quarkly.io/612695d67f2b1f001fa06c1f/images/phone22.png?v=2021-08-26T11%3A41%3A54.452Z&quality=85&w=3200 3200w"
					sizes="(max-width: 576px) 100vw,(max-width: 768px) 100vw,(max-width: 992px) 100vw,100vw"
				/>
			</Box>
			</Section>
			<Section padding="0 0 0 0">
				<Image
					src="https://uploads.quarkly.io/643d8e6ebf72b300207d7233/images/students-studying-together-high-angle-2.jpg?v=2023-05-24T23:42:49.670Z"
					min_width="100px"
					min_height="100px"
					height='600px'
					width='100%'
					object_fit="cover"
				/>
			<Box
				min_width="100px"
				min_height="100px"
				display="flex"
				flex_direction="column"
				padding="80px 60px 80px 60px"
				sm_padding="50px 25px 80px 25px"
			>
				<Text margin="0px 0px 30px 0px" font="--font-landing-page1">
					Easy Knowledge
				</Text>
				<Text margin="0px 0px 25px 0px" font="--font-landing-page2" color="#505257">
					This app works as the simple books reading app, but with some AI features that should help you study much more faster.
				</Text>
				<Text margin="0px 0px 25px 0px" font="--font-landing-page3" color="#505257">
					You can highlight anything in your book. Then it will be added to highlights of the book. After this you can do some things with it:
				</Text>
				<Box
					min_width="10px"
					min_height="10px"
					display="flex"
					font="--font-sansHelvetica1"
					margin="0px 0px 20px 0px"
				>
					<Icon/>
					<Text margin="0px 0px 0px 0px" font="--font-landing-page4" color="#505257">
						<Span
							font="--font-span1"
							overflow_wrap="normal"
							word_break="normal"
							white_space="normal"
							text_indent="0"
							text_overflow="clip"
							hyphens="manual"
							user_select="auto"
							pointer_events="auto"
						>
							Check all highlights:{" "}
						</Span>
						Every highlight you make is automatically added to database. It means that you can access it any time on any device.
					</Text>
				</Box>
				<Box
					min_width="10px"
					min_height="10px"
					display="flex"
					font="--font-sansHelvetica1"
					margin="0px 0px 20px 0px"
				>
					<Icon/>
					<Text margin="0px 0px 0px 0px" font="--font-landing-page4" color="#505257">
						<Span
							font="--font-span1"
							overflow_wrap="normal"
							word_break="normal"
							white_space="normal"
							text_indent="0"
							text_overflow="clip"
							hyphens="manual"
							user_select="auto"
							pointer_events="auto"
						>
							Create test:{" "}
						</Span>
						You can ask AI to analyze your highlights and create test for you. After this you can access it any time you want.
					</Text>
				</Box>
			</Box>
			</Section>
			<Section background="var(--color-darkL1)" padding="50px">
			<Box display="flex" justify_content="space-between" border_color="#232a44" md_flex_direction="column">
				<Box
					display="flex"
					md_margin="0px 20px 15px 20px"
					sm_flex_direction="column"
					justify_content="flex-start"
					align_items="center"
					grid_gap="24px"
				>
					<Box display="flex" grid_gap="8px">
						<Text margin="0px 0px 0px 0px" font="--base" color="white">
							Phone:
						</Text>
						<Link
							href="tel:+9877654321223"
							color="var(--color-light)"
							text_decoration_line="initial"
							font="--base"
							display="block"
							margin="0px 0px 0px 0px"
							sm_margin="0px 0 5px 0px"
							hover_color="#a78bfa"
						>
							+987 (765) 432 12 23
						</Link>
					</Box>
					<Box display="flex" grid_gap="8px">
						<Text margin="0px 0px 0px 0px" color="white" font="--base">
							E-mail:
						</Text>
						<Link
							href="tel:+9877654321223"
							color="var(--color-light)"
							text_decoration-line="initial"
							font="--base"
							display="block"
							margin="0px 0px 0px 0px"
							hover_color="#a78bfa"
						>
							info@yourdomain.com
						</Link>
					</Box>
				</Box>
				<Box display="flex" grid_template_columns="repeat(5, 1fr)" grid_gap="16px 24px" md_align_self="flex-start">
					{/* <LinkBox href="/">
						<Icon
							category="fa"
							icon={FaTwitterSquare}
							size="24px"
							color="#c3c8d0"
							hover_color="#a78bfa"
							transition="background-color 1s ease 0s"
						/>
					</LinkBox>
					<LinkBox href="/">
						<Icon
							category="fa"
							icon={FaGithub}
							size="24px"
							color="#c3c8d0"
							hover_color="#a78bfa"
							transition="background-color 1s ease 0s"
						/>
					</LinkBox>
					<LinkBox href="/">
						<Icon
							category="fa"
							icon={FaYoutube}
							size="24px"
							color="#c3c8d0"
							hover-color="#a78bfa"
							transition="background-color 1s ease 0s"
						/>
					</LinkBox> */}
				</Box>
			</Box>
		</Section>
        </div>
    );
};
