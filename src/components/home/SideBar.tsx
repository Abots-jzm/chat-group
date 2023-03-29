import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { paths } from "../../App";
import useLogout from "../../hooks/auth/useLogout";
import { IoIosArrowBack, IoMdAdd, IoMdClose, IoMdSearch } from "react-icons/io";
import { BiChevronDown } from "react-icons/bi";
import { HiUserCircle } from "react-icons/hi";
import { TbLogout } from "react-icons/tb";
import ListItem from "./ListItem";
import useGetUserProfile from "../../hooks/profile/useGetUserProfile";
import { truncateTxt } from "../../util";
import NewChannelModal from "./NewChannelModal";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../api/firebase";
import useJoinGroup from "../../hooks/chat/useJoinGroup";
import BlankPicture from "../../assets/blank-profile-picture.png";
import GPTLogo from "../../assets/ChatGPT_Logo_PNG1.png";
import { AssistantChannel, Channel } from "./types";
import { UserData } from "../../hooks/profile/types";

type Props = {
	isOpen: boolean;
	logoutModalOpen: boolean;
	setLogoutModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
	activeChannel?: Channel;
	setActiveChannel: React.Dispatch<React.SetStateAction<Channel | undefined>>;
	closeSideBar: () => void;
};

function SideBar({
	isOpen,
	closeSideBar,
	logoutModalOpen,
	setLogoutModalOpen,
	activeChannel,
	setActiveChannel,
}: Props) {
	const { mutate: logout } = useLogout();
	const { data: userData } = useGetUserProfile();
	const { mutate: joinGroup } = useJoinGroup();

	const navigate = useNavigate();
	const { channelId } = useParams();

	const [detailsShown, setDetailsShown] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [data, setData] = useState<Channel[]>();
	const [members, setMembers] = useState<any>();
	const [searchFilter, setSearchFilter] = useState("");

	useEffect(() => {
		setIsLoading(true);
		const unsubscribe1 = onSnapshot(doc(db, "default/info"), (doc) => {
			setData(doc.data()?.channels as Channel[]);
			setIsLoading(false);
		});

		const unsubscribe2 = onSnapshot(doc(db, "default/members"), (doc) => {
			setMembers(doc.data());
		});

		return () => {
			unsubscribe1();
			unsubscribe2();
		};
	}, []);

	function toggleLogoutModal(e: React.MouseEvent<HTMLDivElement>) {
		e.stopPropagation();
		setLogoutModalOpen((prev) => !prev);
	}

	function onChannelClicked(channel: Channel) {
		navigate("/" + channel.id);
		setActiveChannel(channel);
		setDetailsShown(true);
		closeSideBar();
		if (channelId && userData) joinGroup({ channelId, user: userData });
	}

	function onAssistantChannelClicked() {
		navigate("/assistant");
		setActiveChannel(AssistantChannel);
		closeSideBar();
	}

	if (isLoading)
		return (
			<LoadingContainer isOpen={isOpen}>
				<Spinner />
			</LoadingContainer>
		);

	return (
		<Container isOpen={isOpen}>
			{modalOpen && <NewChannelModal user={userData} closeModal={() => setModalOpen(false)} />}
			{isOpen && (
				<Close onClick={closeSideBar}>
					<IoMdClose />
				</Close>
			)}
			<Top>
				{detailsShown && (
					<div className="back" onClick={() => setDetailsShown(false)}>
						<IoIosArrowBack />
					</div>
				)}
				<div>{detailsShown ? "All channels" : "Channels"}</div>
				{!detailsShown && (
					<div className="icon" onClick={() => setModalOpen(true)}>
						<IoMdAdd />
					</div>
				)}
			</Top>
			<Middle>
				{!detailsShown && (
					<>
						<SearchContainer>
							<p>
								<IoMdSearch />
							</p>
							<input type="text" placeholder="Search" onChange={(e) => setSearchFilter(e.target.value)} />
						</SearchContainer>
						<Channels>
							<ListItem name="AI Assistant" mode="member" onClick={onAssistantChannelClicked} imageURL={GPTLogo} />
							{data
								?.filter((channel) => channel.name.toLowerCase().trim().includes(searchFilter.toLowerCase().trim()))
								.map((channel) => (
									<ListItem
										name={channel.name}
										mode="channel"
										onClick={() => onChannelClicked(channel)}
										key={channel.id}
									/>
								))}
						</Channels>
					</>
				)}
				{detailsShown && (
					<>
						<ChannelDetials>
							<div className="title">{activeChannel?.name}</div>
							<div>{activeChannel?.description}</div>
							<div className="member">MEMBERS</div>
							<MembersContainer>
								{members[channelId!].map((member: UserData, i: number) => (
									<ListItem name={member.displayName} mode="member" imageURL={member.photoURL} key={i} />
								))}
							</MembersContainer>
						</ChannelDetials>
					</>
				)}
			</Middle>
			<Bottom>
				<Photo>
					<img src={userData?.photoURL || BlankPicture} alt="profile pic" />
				</Photo>
				<DisplayName>{truncateTxt(userData?.displayName || "", 15)}</DisplayName>
				<Icon onClick={toggleLogoutModal}>
					<BiChevronDown />
					<LogoutModal isOpen={logoutModalOpen} onClick={(e) => e.stopPropagation()}>
						<div className="profile" onClick={() => navigate(paths.PROFILE)}>
							<p>
								<HiUserCircle />
							</p>
							My Profile
						</div>
						<p className="line" />
						<div className="logout" onClick={() => logout()}>
							<p>
								<TbLogout />
							</p>
							Logout
						</div>
					</LogoutModal>
				</Icon>
			</Bottom>
		</Container>
	);
}

export default SideBar;

const spinner = keyframes`
   100% {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
	width: 5rem;
	height: 5rem;
	border-radius: 50%;
	border-left: 2px solid white;
	animation: ${spinner} 1s linear infinite;
`;

const MembersContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 3.2rem;
`;

const ChannelDetials = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1.7rem;
	font-size: 1.8rem;

	.title {
		font-weight: 700;
		text-transform: uppercase;
	}

	.member {
		margin-top: 2.6rem;
		font-weight: 700;
	}
`;

interface ILogoutModal {
	isOpen: boolean;
}

const LogoutModal = styled.div<ILogoutModal>`
	display: ${(props) => (props.isOpen ? "flex" : "none")};
	position: absolute;
	bottom: 2.5rem;
	right: 0;
	width: 19.2rem;
	padding: 1.3rem;
	background-color: #252329;
	border: 1px solid #3c393f;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	border-radius: 12px;
	font-size: 1.2rem;
	font-weight: 500;
	flex-direction: column;
	gap: 2.4rem;

	& > div {
		padding: 1.1rem;
		border-radius: 8px;
		padding-left: 4.1rem;
		position: relative;
		cursor: pointer;

		p {
			position: absolute;
			left: 1.1rem;
			font-size: 2rem;
			display: grid;
			place-items: center;
			top: 0.9rem;
		}

		&:hover {
			background-color: #3c393f;
		}
	}

	.line {
		background-color: #3c393f;
		width: 16.4rem;
		height: 1px;
		position: absolute;
		top: 6.4rem;
	}

	.profile {
		color: #e0e0e0;
	}

	.logout {
		color: #eb5757;
	}
`;

const Icon = styled.div`
	display: grid;
	place-items: center;
	color: #828282;
	font-size: 2.4rem;
	position: relative;
	cursor: pointer;
`;

const DisplayName = styled.div`
	color: #828282;
	font-size: 1.8rem;
	font-weight: 700;
	margin-right: auto;
`;

const Photo = styled.div`
	overflow: hidden;
	border-radius: 7px;
	height: 4.2rem;
	width: 4.2rem;

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}
`;

const Bottom = styled.div`
	background-color: #0b090c;
	padding: 2rem 2.5rem;
	display: flex;
	align-items: center;
	gap: 2.6rem;
`;

const Channels = styled.div`
	display: flex;
	flex-direction: column;
	gap: 2.1rem;
	margin-top: 3.4rem;
`;

const SearchContainer = styled.div`
	background-color: transparent;
	position: relative;

	p {
		position: absolute;
		left: 1.2rem;
		top: 1rem;
		color: white;
		font-size: 2.5rem;
	}

	input {
		width: 100%;
		background-color: #3c393f;
		padding: 1.4rem;
		padding-left: 4.4rem;
		color: white;
		font-size: 1.4rem;
		font-weight: 500;
		border-radius: 8px;
		border: none;

		&::placeholder {
			color: #828282;
		}
	}
`;

const Middle = styled.div`
	padding: 2rem 2.5rem;
	margin-bottom: auto;
	overflow-y: auto;

	&::-webkit-scrollbar {
		width: 5px;
	}

	&::-webkit-scrollbar-track {
		background-color: rgba(0, 0, 0, 0.1);
		border-radius: 100rem;
	}

	&::-webkit-scrollbar-thumb {
		height: 1rem;
		background: rgba(255, 255, 255, 0.6);
		border-radius: 100rem;
	}
`;

const Close = styled.div`
	width: 3.8rem;
	height: 3.8rem;
	background: #120f13;
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
	border-radius: 12px;
	color: white;
	position: absolute;
	top: 1rem;
	right: -4.5rem;
	font-size: 2.4rem;
	cursor: pointer;
	display: none;

	@media only screen and (max-width: 900px) {
		display: grid;
		place-items: center;
	}
`;

const Top = styled.div`
	font-weight: 700;
	padding: 1.35rem 2.5rem;
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
	font-size: 1.8rem;
	display: flex;
	align-items: center;
	gap: 2rem;

	.back {
		cursor: pointer;
		font-size: 2.4rem;
		display: grid;
		place-items: center;
		height: 3.2rem;
	}

	.icon {
		margin-left: auto;
		font-size: 2.4rem;
		display: grid;
		place-items: center;
		cursor: pointer;
		background-color: #252329;
		border-radius: 8px;
		height: 3.2rem;
		width: 3.2rem;
		color: #f2f2f2;
	}
`;

interface IContainer {
	isOpen: boolean;
}

const Container = styled.div<IContainer>`
	flex-basis: 32.4rem;
	background-color: #120f13;
	display: flex;
	flex-direction: column;

	@media only screen and (max-width: 900px) {
		position: fixed;
		left: 0;
		top: 0;
		width: 32.4rem;
		height: 100%;
		transform: translateX(${(props) => (props.isOpen ? "0" : "-100%")});
		transition: transform 0.5s;
		z-index: 3;
	}
`;

const LoadingContainer = styled(Container)`
	display: grid;
	place-items: center;
`;
