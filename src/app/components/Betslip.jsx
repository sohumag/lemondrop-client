'use client'

import React, { useContext, useState, useEffect } from 'react'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Backdrop } from '@mui/material'
import axios from 'axios'
import getAuth from '../functions/getAuth';
import Link from 'next/link'

import { CounterContext } from "../context/bets.context";

const Betslip = () => {
	const { state, dispatch } = useContext(CounterContext)

	const [user, setUser] = useState({})
	const [userIsSignedIn, setUserIsSignedIn] = useState(false)
	const [isParlay, setIsParlay] = useState(false)
	const [mobileOpen, setMobileOpen] = useState(false)
	const [parlayOdds, setParlayOdds] = useState(0)
	const [parlayWagerAmt, setParlayWagerAmt] = useState(10)
	const [parlayWinAmt, setParlayWinAmt] = useState(0)
	const [submitting, setSubmitting] = useState(false)

	const [mobileBets, setMobileBets] = useState(state.bets)


	useEffect(() => {
		getAuth().then(u => {
			setUser(u)
			setUserIsSignedIn(JSON.stringify(u) !== '{}')
		})
	}, [])

	const deleteAllBets = () => {
		return
	}

	useEffect(() => {
		// calculating parlay odds
		let currentOdds = 1
		state.bets.forEach(bet => {
			let priceFloat = 0
			const priceString = String(bet.price)
			if (priceString[0] == "+") {
				priceFloat = parseInt(priceString.substring(1, priceString.length))
			} else {
				priceFloat = parseInt(priceString.substring(1, priceString.length)) * -1
			}
			const decimalOdds = priceFloat > 0 ? 1 + (priceFloat / 100) : 1 - (100 / priceFloat)
			currentOdds *= decimalOdds
		})

		setParlayWinAmt(parlayWagerAmt * currentOdds)

		let americanOdds = 0
		if (currentOdds > 2) {
			americanOdds = (currentOdds - 1) * 100
			setParlayOdds(`+${americanOdds.toFixed(0)}`)
		} else {
			americanOdds = -100 / (currentOdds - 1)
			setParlayOdds(`${americanOdds.toFixed(0)}`)
		}

	}, [state, parlayWagerAmt])

	const wagerChanged = (e) => {
		let amt = e.target.value;
		const regex = /^(\d{0,5}\.\d{1,2}|\d{1,5})$/;
		if (amt === '' || regex.test(amt)) {
			amt = amt > 300 ? 300 : amt
			setParlayWagerAmt(amt);
		}
	}

	// const submitBets = () => {
	// 	// const url = "https://lemondrop-api.onrender.com/api/bets/bet"
	// 	const url = "http://localhost:8080/api/bets/bet"
	// 	// const parlayUrl = "https://lemondrop-api.onrender.com/api/bets/bet"
	// 	const parlayUrl = "http://localhost:8080/api/bets/bet"
	// 	setSubmitting(true)
	// 	if (bets.length >= 2 && isParlay) {
	// 		submitBetsParlay(parlayUrl)
	// 	}

	// 	else {
	// 		submitBetsSingles(url)
	// 	}
	// }

	// const submitBetsParlay = (url) => {
	// 	var date = new Date();
	// 	var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
	// 		date.getUTCDate(), date.getUTCHours(),
	// 		date.getUTCMinutes(), date.getUTCSeconds());

	// 	const parlay = {
	// 		is_parlay: true,

	// 		user_id: user.user_id,
	// 		user_email: user.email,

	// 		bets: [],
	// 		bet_placed_time: new Date(now_utc),
	// 		bet_price: parlayOdds,
	// 		bet_amount: String(parlayWagerAmt)
	// 	}

	// 	parlay.bets = bets.map(bet => {
	// 		var date = new Date();
	// 		var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
	// 			date.getUTCDate(), date.getUTCHours(),
	// 			date.getUTCMinutes(), date.getUTCSeconds());
	// 		return {
	// 			is_parlay: false,
	// 			user_id: user.user_id,
	// 			user_email: user.email,

	// 			game_id: bet.GameId,
	// 			game_hash: bet.GameHash,
	// 			home_team: bet.HomeTeam,
	// 			away_team: bet.AwayTeam,

	// 			bet_type: bet.BetType,
	// 			bet_on_team: bet.BetOnTeam,

	// 			bet_point: bet.Point,
	// 			bet_price: bet.price,
	// 			bet_amount: String(bet.Amount),

	// 			bet_placed_time: new Date(now_utc),
	// 		}
	// 	})
	// 	axios.post(url, parlay).then(() => {
	// 		console.log("parlay placed")
	// 		deleteAllBets()

	// 	}).catch(err => {
	// 		return
	// 	}).finally(() => {
	// 		setSubmitting(false)
	// 	})

	// }

	// const submitBetsSingles = (url) => {
	// 	state.bets.forEach(bet => {
	// 		if (!bet.price || !bet.Amount) {
	// 			return
	// 		}
	// 	})

	// 	var date = new Date();
	// 	var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
	// 		date.getUTCDate(), date.getUTCHours(),
	// 		date.getUTCMinutes(), date.getUTCSeconds());

	// 	const singleBet = {
	// 		user_id: user.user_id,
	// 		user_email: user.email,
	// 		bets: [],
	// 		is_parlay: false,
	// 		bet_placed_time: new Date(now_utc),
	// 	}

	// 	for (let i = 0; i < bets.length; i++) {
	// 		const bet = bets[i]
	// 		var date = new Date();
	// 		var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
	// 			date.getUTCDate(), date.getUTCHours(),
	// 			date.getUTCMinutes(), date.getUTCSeconds());

	// 		const b = {
	// 			user_id: user.user_id,
	// 			user_email: user.email,

	// 			game_id: bet.GameId,
	// 			game_hash: bet.GameHash,
	// 			home_team: bet.HomeTeam,
	// 			away_team: bet.AwayTeam,

	// 			bet_type: bet.BetType,
	// 			bet_on_team: bet.BetOnTeam,

	// 			bet_point: bet.Point,
	// 			bet_price: bet.price,
	// 			bet_amount: String(bet.Amount),

	// 			bet_placed_time: new Date(now_utc),
	// 		}

	// 		singleBet.bets.push(b)
	// 	}

	// 	axios.post(url, singleBet).then(() => {
	// 		console.log(singleBet)
	// 		console.log("bet placed")
	// 		deleteAllBets()
	// 	}).catch(err => {
	// 		return
	// 	}).finally(() => {
	// 		setSubmitting(false)
	// 	})
	// }

	const submitBets = () => {
		// const url = "http://localhost:8080/api/bets/bet";
		const url = "https://lemondrop-api.onrender.com/api/bets/bet"
		setSubmitting(true);
		const allBets = []

		// parlay
		if (isParlay) {
			const selections = []
			state.bets.forEach((bet) => {
				const betSelection = {
					bet_type: bet.betType,
					prop_type: "",
					prop_name: "",
					player_name: "",
					bet_on: bet.betOnTeam,
					bet_point: bet.point,
					odds: bet.price,

					game_id: bet.gameId,
					game_hash: bet.gameHash,
					home_team_name: bet.homeTeam,
					away_team_name: bet.awayTeam,

					// add league and sport info after..
					// add hash of bet to validate 
				};
				selections.push(betSelection)
			});

			const betData = {
				user_id: user.user_id,
				bet_amount: String(parlayWagerAmt),
				is_parlay: true,
				selections: selections,
				jwt: localStorage.getItem('jwt')
			};

			allBets.push(betData)
		}

		// singles	
		else {
			state.bets.forEach((bet) => {
				const singleBet = {
					user_id: user.user_id,
					bet_amount: String(bet.amount),
					is_parlay: false,
					jwt: localStorage.getItem('jwt'),
					selections: [
						{
							bet_type: bet.betType,
							prop_type: "",
							prop_name: "",
							player_name: "",
							bet_on: bet.betOnTeam,
							bet_point: bet.point,
							odds: bet.price,

							game_id: bet.gameId,
							game_hash: bet.gameHash,
							home_team_name: bet.homeTeam,
							away_team_name: bet.awayTeam,
						}
					],
				};

				allBets.push(singleBet)
			});
		}

		// console.log(allBets)
		axios.post(url, allBets).then(() => {
			console.log(isParlay ? "parlay placed" : "bet placed");
			// navigate to bet placed success
		}).catch((err) => {
			console.error(err);
			// show bet placed error
		})
			.finally(() => {
				setSubmitting(false);
			});
	};


	const handleMobileDeleteAll = () => {
		setMobileOpen(false)
		deleteAllBets()
	}

	useEffect(() => {
		setMobileBets(state.bets)
	}, [state.bets])

	return (
		<div className="">

			{/* <div className="bet-slip  "> */}
			<div className="w-full flex-col justify-between h-full overflow-hidden hidden lg:flex">
				<div className="bet-slip-content">



					<div className="bet-slip-header">

						<div className="bet-slip-header-main mb-4">
							<div className="bet-slip-header-count">
								{state.bets.length}
							</div>
							<h6 className="font-bold text-base text-md font-gray" >Betslip</h6>
						</div>

						<div className="flex ">
							<div className={isParlay ? "tab-container" : "tab-container-active tab-container"} onClick={() => setIsParlay(false)}>
								<p className={isParlay ? "text-gray-700 text-sm font-semibold" : "text-white text-sm font-semibold "}>SINGLES</p>
							</div>
							<div className={isParlay ? "tab-container-active tab-container" : "tab-container"} onClick={() => setIsParlay(true)}>
								<p className={isParlay ? "text-white text-sm font-semibold" : "text-gray-700 text-sm font-semibold"}>PARLAY</p>
							</div>
						</div>
					</div>

					{(!userIsSignedIn) && (
						<div className="bg-darkGray py-16 border-b border-t border-gray-600 flex justify-center ">
							<Link href="/signup">
								<h6 className="text-gray-700 underline text-xl">JOIN LEMONDROP</h6>
							</Link>
						</div>
					)}

					{userIsSignedIn && state.bets.length === 0 && (
						<div className="bg-darkGray py-16 border-b border-t border-gray-600 flex justify-center">
							<h6 className="text-gray-700  text-xl">EMPTY BETSLIP</h6>
						</div>
					)}

					{userIsSignedIn && state.bets.length > 0 && (
						<div className="bet-slip-option-container">
							{isParlay && state.bets.length >= 2 && (
								<div className="parlay-options" style={{ borderBottom: '1px solid #444' }}>
									<div className="parlay-odds-display">
										<p className="font-bold text-white">PARLAY ODDS</p>
										<p className="font-bold text-gray-400">{parlayOdds}</p>
									</div>


									<div className="flex justify-between w-full items-center mb-2 mt-4">
										<div className="w-full h-full justify-center flex flex-col items-start ">
											<input
												type="number"
												min="0"
												max="300"
												id="wager"
												onChange={(e) => wagerChanged(e)}
												value={isNaN(parlayWagerAmt) || parlayWagerAmt > 300 ? 300 : parlayWagerAmt}
												className="border-none focus:ring-transparent outline-none text-gray-900 text-sm rounded-lg block w-full p-2.5"
												placeholder={(isNaN(parseFloat(parlayWagerAmt)) || parseFloat(parlayWagerAmt) > 300 ? 300 : parseFloat(parlayWagerAmt)).toFixed(2)}
												style={{ appearance: 'none' }}
												required
											/>
										</div>

										<div className="w-full h-full justify-center flex flex-col items-end ">
											<p className="text-xs  text-gray-500 " >To Win:</p>
											<p className="text-lg font-bold " >${parseFloat(parlayWinAmt).toFixed(2)}</p>
										</div>
									</div>

								</div>
							)}

							{state.bets.map(bet => (
								<BetslipOption key={bet.BetOnTeam} isParlay={isParlay} bet={bet} />
							))}
						</div>
					)}
				</div>

				{userIsSignedIn && state.bets.length > 0 && (
					<div >
						<button
							className="w-full border border-red-600  text-red-600 font-bold py-2 my-4"
							onClick={deleteAllBets}
						>
							<span className="mr-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									className="h-4 w-4 inline-block"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</span>
							Delete All
						</button>



						<button
							className="w-full bg-yellow text-dark font-bold py-2"
							onClick={submitBets}
							disabled={submitting || !((!isParlay) || (isParlay && state.bets.length >= 2 && parlayWagerAmt > 0))}
						>
							Submit Bets
						</button>
					</div>
				)}
			</div>


			{state.bets.length > 0 && (
				<div className="lg:hidden"  >
					<div className="mobile-bet-slip-fab" onClick={() => setMobileOpen(true)} >
						<span className="mr-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								className="h-6 w-6 inline-block"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M12 4v16m8-8H4"
								/>
							</svg>
						</span>
						<div onClick={() => setMobileOpen(true)} >
							<p className="font-bold text-base"> {state.bets.length} Betslip</p>
						</div>

					</div>

					{mobileOpen && (
						// <div className="absolute left-0 top-0 w-full h-full overflow-clip">
						<Backdrop open={mobileOpen} className="mobile-bet-slip-option-container">
							<div className="mobile-bet-slip-open">
								<div className="close-icon-container" onClick={() => setMobileOpen(false)}>
									<p className="font-bold text-lg text-gray-700">BETSLIP</p>
									<span className="ml-2">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											className="h-6 w-6 inline-block"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
									</span>
								</div>

								<div className={"bet-slip-header-tabs pt-4"} style={{ marginBottom: '2em' }}>
									<div className={isParlay ? "tab-container" : "tab-container-active tab-container"} onClick={() => setIsParlay(false)}>
										<p className={isParlay ? "text-gray-700 font-bold" : "text-white font-bold"}>SINGLES</p>
									</div>
									<div className={isParlay ? "tab-container-active tab-container" : "tab-container"} onClick={() => setIsParlay(true)}>
										<p className={isParlay ? "text-white font-bold" : "text-gray-700 font-bold"}>PARLAY</p>
									</div>
								</div>

								<div className={"mobile-bet-slip-open-main"}>
									{isParlay && state.bets.length >= 2 && (
										<div className="parlay-options">
											<div className="parlay-odds-display">
												<p className="font-bold text-white">PARLAY ODDS</p>
												<p className="font-bold text-gray-400">{parlayOdds}</p>
											</div>
											<div className="flex justify-between w-full items-center mb-4 mt-6 border-b pb-4 border-gray-400">
												<div className="w-full h-full justify-center flex flex-col items-start ">
													<input
														type="number"
														min="0"
														max="300"
														id="wager"
														onChange={(e) => wagerChanged(e)}
														value={isNaN(parlayWagerAmt) || parlayWagerAmt > 300 ? 300 : parlayWagerAmt}
														className="border-none focus:ring-transparent outline-none text-gray-900 text-sm rounded-lg block w-full p-2.5"
														placeholder={(isNaN(parseFloat(parlayWagerAmt)) || parseFloat(parlayWagerAmt) > 300 ? 300 : parseFloat(parlayWagerAmt)).toFixed(2)}
														style={{ appearance: 'none' }}
														required
													/>
												</div>

												<div className="w-full h-full justify-center flex flex-col items-end ">
													<p className="text-xs  text-gray-500 " >To Win:</p>
													<p className="text-lg font-bold " >${parseFloat(parlayWinAmt).toFixed(2)}</p>
												</div>
											</div>
										</div>
									)}

									{mobileBets.map(bet => (
										<BetslipOption key={bet.BetOnTeam} bet={bet} isParlay={isParlay} />
									))}
								</div>

								<div className={"mobile-bet-slip-open-actions"}>
									<button
										className="w-full border bg-white text-red-500 font-bold py-2 my-4"
										onClick={handleMobileDeleteAll}
									>
										<span className="mr-2">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												className="h-4 w-4 inline-block"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M6 18L18 6M6 6l12 12"
												/>
											</svg>
										</span>
										Delete All
									</button>
									<button
										className="w-full bg-yellow text-dark font-bold py-2"
										onClick={submitBets}
										disabled={submitting || !((!isParlay) || (isParlay && state.bets.length >= 2 && parlayWagerAmt > 0))}
									>
										Submit Bets
									</button>
								</div>
							</div>
						</Backdrop>
					)}
				</div>
			)}
		</div>

	)
}



const BetslipOption = ({ bet, isParlay }) => {
	const priceString = String(bet.price)
	const priceFloat = priceString.charAt(0) === '+' ? parseInt(priceString.substring(1)) : parseInt(priceString.substring(1)) * -1;
	const decimalOdds = priceFloat > 0 ? 1 + priceFloat / 100 : 1 - 100 / priceFloat;
	const { state, dispatch } = useContext(CounterContext)
	const [amount, setAmount] = useState(bet.amount);
	const [toWinAmount, setToWinAmount] = useState((Math.floor(100 * amount * decimalOdds) / 100).toFixed(2));

	useEffect(() => {
		setAmount(bet.amount)
	}, [bet])

	const removeBet = () => {
		dispatch({ betOnTeam: bet.betOnTeam, betType: bet.betType, gameId: bet.gameId, gameHash: bet.gameHash, index: bet.index, amount: bet.amount })
	}

	const updateBet = (amt) => {
		dispatch({ type: "update", betOnTeam: bet.betOnTeam, betType: bet.betType, gameId: bet.gameId, gameHash: bet.gameHash, index: bet.index, amount: amt });
	}

	const wagerChanged = (e) => {
		let amt = e.target.value;
		const regex = /^(\d{0,5}\.\d{1,2}|\d{1,5})$/;
		if (amt === '' || regex.test(amt)) {
			amt = amt > 300 ? 300 : amt
			updateBet(amt)
			setToWinAmount((Math.floor(100 * amt * decimalOdds) / 100).toFixed(2));
		}
	};

	return (
		<div className="flex items-start mb-4 mt-2  ">

			<div onClick={removeBet} className="cursor-pointer mt-1 mr-2">
				<RemoveCircleOutlineIcon style={{ color: '#ff3008' }} />
			</div>

			<div className="betslip-option-container w-full">

				<div className="flex items-start justify-between ">
					<div >
						<div className="">
							<p className="text-sm font-bold">{bet.betOnTeam}</p>
							<p className="text-xs text-gray-700">{bet.betType.toUpperCase()}</p>
						</div>
					</div>

					<div >
						<p className="text-sm font-bold  text-gray-400 ">{bet.price}</p>
					</div>

				</div>

				{!isParlay && (
					<div className="flex justify-between items-center mt-2">
						<div className="w-full h-full justify-center flex flex-col items-start ">
							<input
								type="number"
								min="0"
								max="300"
								id="wager"
								onChange={(e) => wagerChanged(e)}
								value={isNaN(amount) || amount > 300 ? 300 : amount}
								className="border-none bg-gray-800 focus:ring-transparent outline-none text-gray-100 text-sm rounded-lg block w-full p-2.5"
								placeholder={(isNaN(parseFloat(amount)) || parseFloat(amount) > 300 ? 300 : parseFloat(amount)).toFixed(2)}
								style={{ appearance: 'none' }}
								required
							/>
						</div>

						<div className="w-full h-full justify-center flex flex-col items-end ">
							<p className="text-xs  text-gray-500 " >To Win:</p>
							<p className="text-lg font-bold" >${toWinAmount}</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};


export default Betslip