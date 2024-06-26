import Link from 'next/link'

async function getData() {
  // const url = "http://localhost:8080/api/leagues"
  const url = "https://lemondrop-api.onrender.com/api/leagues"
  const res = await fetch(url, {
    cache: "no-cache",
    headers: {
      "lemondrop_api_key": ""
    },
  });


  let body = await res.json();
  return body;
}

export default async function Page() {
  const sports = await getData()
  return (
    <div className="">
      <div className="">
        <div className="p-2 mt-4 md:mt-0">
          <div>
            <h6 className="font-bold text-lg text-gray-300">All Leagues</h6>
          </div>

          <div>
            {sports.map((l) => (
              <LeagueSelector league={l} key={l.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
const LeagueSelector = ({ league }) => {
  return (
    <Link href={`/games/${league.league_id}`} className=" " prefetch={false} >
      <div className="px-4 py-4 my-3 bg-bgdGray">
        <p className="font-bold text-base text-white">{league.league_name}</p>
        {/* <ArrowForwardIosIcon className="text-base" /> */}
      </div>
    </Link>

  )
}

