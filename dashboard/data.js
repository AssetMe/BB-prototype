// BenchBrawl visibility dashboard — mock dataset grounded in real-world research
// (PrizePicks, Underdog, Sleeper, Fliff, Splash, Dabble, ParlayPlay, DK Pick6, Chalkboard)

const COMPETITORS = [
  { name: 'PrizePicks',        slug: 'prizepicks',     domain: 'prizepicks.com',     color: '#7c3aed', mention: 84, citation: 71, position: 1.3, share: 26 },
  { name: 'Underdog Fantasy',  slug: 'underdog',       domain: 'underdogfantasy.com', color: '#22c55e', mention: 76, citation: 62, position: 1.7, share: 22 },
  { name: 'Sleeper',           slug: 'sleeper',        domain: 'sleeper.com',         color: '#fb923c', mention: 61, citation: 47, position: 2.3, share: 16 },
  { name: 'DraftKings Pick6',  slug: 'pick6',          domain: 'pick6.draftkings.com',color: '#10b981', mention: 53, citation: 42, position: 2.7, share: 13 },
  { name: 'Fliff Superstars',  slug: 'fliff',          domain: 'getfliff.com',        color: '#f43f5e', mention: 47, citation: 35, position: 3.0, share: 10 },
  { name: 'Splash Sports',     slug: 'splash',         domain: 'splashsports.com',    color: '#0ea5e9', mention: 41, citation: 31, position: 3.3, share: 9  },
  { name: 'Dabble',            slug: 'dabble',         domain: 'dabble.com',          color: '#eab308', mention: 31, citation: 23, position: 3.8, share: 6  },
  { name: 'ParlayPlay',        slug: 'parlayplay',     domain: 'parlayplay.com',      color: '#a855f7', mention: 24, citation: 17, position: 4.4, share: 5  },
  { name: 'Chalkboard',        slug: 'chalkboard',     domain: 'chalkboard.io',       color: '#64748b', mention: 14, citation: 10, position: 5.0, share: 3  },
  { name: 'BenchBrawl',        slug: 'benchbrawl',     domain: 'benchbrawl.com',      color: '#D0F500', mention: 9,  citation: 4,  position: 5.8, share: 2, isPrimary: true },
];

// Top cited domains across all 95 prompts. Counts roughly proportional to LLM citation patterns
// for sports / DFS / pick'em queries.
const CITATIONS_DOMAINS = [
  { domain: 'reddit.com',                cited: 47, rate: 22.1 },
  { domain: 'prizepicks.com',            cited: 41, rate: 19.3 },
  { domain: 'underdogfantasy.com',       cited: 38, rate: 17.9 },
  { domain: 'legalsportsreport.com',     cited: 33, rate: 15.6 },
  { domain: 'sportshandle.com',          cited: 29, rate: 13.7 },
  { domain: 'sleeper.com',               cited: 27, rate: 12.7 },
  { domain: 'fantasylabs.com',           cited: 24, rate: 11.3 },
  { domain: 'getfliff.com',              cited: 22, rate: 10.4 },
  { domain: 'splashsports.com',          cited: 21, rate: 9.9  },
  { domain: 'rotogrinders.com',          cited: 19, rate: 8.9  },
  { domain: 'cbssports.com',             cited: 18, rate: 8.5  },
  { domain: 'dailyedgesports.com',       cited: 17, rate: 8.0  },
  { domain: 'sbcamericas.com',           cited: 15, rate: 7.1  },
  { domain: 'deadspin.com',              cited: 14, rate: 6.6  },
  { domain: 'pick6.draftkings.com',      cited: 13, rate: 6.1  },
  { domain: 'thelines.com',              cited: 12, rate: 5.6  },
  { domain: 'apps.apple.com',            cited: 11, rate: 5.2  },
  { domain: 'props.com',                 cited: 10, rate: 4.7  },
  { domain: 'youtube.com',               cited: 10, rate: 4.7  },
  { domain: 'parlayplay.com',            cited: 9,  rate: 4.2  },
  { domain: 'dabble.com',                cited: 8,  rate: 3.7  },
  { domain: 'oddsassist.com',            cited: 7,  rate: 3.3  },
  { domain: 'gamblinginsider.com',       cited: 6,  rate: 2.8  },
  { domain: 'closingline.substack.com',  cited: 5,  rate: 2.3  },
  { domain: 'benchbrawl.com',            cited: 4,  rate: 1.9, primary: true },
];

// Most-cited specific pages
const CITATIONS_PAGES = [
  { domain: 'reddit.com',            path: '/r/dfsports/comments/best-pickem-apps-2026',                 cited: 14 },
  { domain: 'sportshandle.com',      path: '/best-dfs-sites/',                                            cited: 12 },
  { domain: 'fantasylabs.com',       path: '/articles/top-dfs-sites/',                                    cited: 11 },
  { domain: 'legalsportsreport.com', path: '/dfs-sites/',                                                 cited: 10 },
  { domain: 'prizepicks.com',        path: '/resources/states-where-you-can-play-prizepicks',             cited: 9  },
  { domain: 'splashsports.com',      path: '/games/pick-em',                                              cited: 8  },
  { domain: 'underdogfantasy.com',   path: '/pickem-champions',                                           cited: 8  },
  { domain: 'getfliff.com',          path: '/pickem',                                                     cited: 7  },
  { domain: 'cbssports.com',         path: '/betting/news/best-dfs-apps/',                                cited: 6  },
  { domain: 'dailyedgesports.com',   path: '/pickem-legality-by-state/',                                  cited: 6  },
  { domain: 'sbcamericas.com',       path: '/2026/01/08/fliff-dfs-superstars-launch-licenses/',           cited: 5  },
  { domain: 'rotogrinders.com',      path: '/fantasy/prizepicks-vs-underdog',                             cited: 5  },
  { domain: 'thelines.com',          path: '/fantasy-sports/fliff-superstars-fantasy/',                   cited: 4  },
  { domain: 'benchbrawl.com',        path: '/',                                                           cited: 2, primary: true },
  { domain: 'benchbrawl.com',        path: '/creators',                                                   cited: 1, primary: true },
  { domain: 'benchbrawl.com',        path: '/blog/how-pickem-scoring-works',                              cited: 1, primary: true },
];

// Topics aggregate
const TOPICS = [
  { name: 'Branded',                 prompts: 12, mention: 92.0, citation: 38.0, position: 1.8 },
  { name: 'Creator monetization',    prompts: 11, mention: 16.0, citation: 7.0,  position: 5.4 },
  { name: 'Comparison & alternatives', prompts: 11, mention: 18.0, citation: 9.0,  position: 4.9 },
  { name: 'Peer-to-peer',            prompts: 7,  mention: 14.0, citation: 5.0,  position: 5.6 },
  { name: 'Creator & host',          prompts: 7,  mention: 11.0, citation: 4.0,  position: 5.7 },
  { name: 'MLB',                     prompts: 10, mention: 10.0, citation: 4.0,  position: 5.5 },
  { name: 'Cash prizes',             prompts: 5,  mention: 10.0, citation: 5.0,  position: 5.4 },
  { name: 'Skill-based contests',    prompts: 4,  mention: 9.0,  citation: 3.0,  position: 5.5 },
  { name: 'NFL',                     prompts: 24, mention: 8.0,  citation: 3.0,  position: 5.8 },
  { name: 'Social & friends',        prompts: 12, mention: 8.0,  citation: 3.0,  position: 5.7 },
  { name: 'Education',               prompts: 9,  mention: 7.0,  citation: 2.0,  position: 5.6 },
  { name: 'Odds & spread',           prompts: 6,  mention: 6.0,  citation: 2.0,  position: 5.8 },
  { name: 'NBA',                     prompts: 3,  mention: 6.0,  citation: 0.0,  position: 6.2 },
  { name: 'Legal & state availability', prompts: 8,  mention: 5.0,  citation: 1.0,  position: 6.1 },
  { name: 'Discovery',               prompts: 9,  mention: 4.0,  citation: 1.0,  position: 6.4 },
  { name: 'NHL',                     prompts: 1,  mention: 0.0,  citation: 0.0,  position: 0   },
  { name: 'UFC',                     prompts: 1,  mention: 0.0,  citation: 0.0,  position: 0   },
  { name: 'College Football',        prompts: 1,  mention: 0.0,  citation: 0.0,  position: 0   },
];

// 95 prompts. Topic strings are pipe-joined. mr/cr/pos are mock but realistic given prompt type.
// branded prompts → high mention; non-branded → low; "BenchBrawl vs X" → 100% mention.
const PROMPTS = [
  // ========== NFL (rows 2-21 + a few from later) ==========
  { id:1,  text:"What is the best pick'em app for the NFL season?",                                        topics:"NFL|Discovery",                       branded:false, mr:25, cr:0,  pos:6.0 },
  { id:2,  text:"What are the best NFL pick'em platforms for 2026?",                                       topics:"NFL|Discovery",                       branded:false, mr:50, cr:25, pos:5.0 },
  { id:3,  text:"Where can I play weekly NFL pick'em contests with friends?",                              topics:"NFL|Social & friends",                branded:false, mr:25, cr:0,  pos:6.0 },
  { id:4,  text:"How do I host an NFL pick'em league for my friends?",                                     topics:"NFL|Creator & host",                  branded:false, mr:25, cr:25, pos:5.0 },
  { id:5,  text:"What's a good alternative to ESPN pick'em for NFL?",                                      topics:"NFL|Comparison & alternatives",       branded:false, mr:0,  cr:0,  pos:0   },
  { id:6,  text:"Best NFL pick'em app with cash prizes",                                                   topics:"NFL|Cash prizes",                     branded:false, mr:25, cr:25, pos:5.0 },
  { id:7,  text:"How can I run a paid NFL pick'em contest legally?",                                       topics:"NFL|Legal & state availability",      branded:false, mr:0,  cr:0,  pos:0   },
  { id:8,  text:"What are skill-based NFL prediction games I can play?",                                   topics:"NFL|Skill-based contests",            branded:false, mr:25, cr:0,  pos:6.0 },
  { id:9,  text:"Where can I make NFL picks against the spread for prizes?",                               topics:"NFL|Odds & spread",                   branded:false, mr:0,  cr:0,  pos:0   },
  { id:10, text:"NFL pick'em apps that use real Vegas odds",                                               topics:"NFL|Odds & spread",                   branded:false, mr:25, cr:0,  pos:5.0 },
  { id:11, text:"Best NFL prediction games for the 2026 season",                                           topics:"NFL|Discovery",                       branded:false, mr:25, cr:25, pos:5.0 },
  { id:12, text:"How do NFL pick'em pools with point spreads work?",                                       topics:"NFL|Education",                       branded:false, mr:0,  cr:0,  pos:0   },
  { id:13, text:"Are there NFL pick'em apps where I can play against friends instead of the house?",      topics:"NFL|Peer-to-peer",                    branded:false, mr:50, cr:25, pos:4.0 },
  { id:14, text:"Best peer-to-peer NFL pick'em platforms",                                                 topics:"NFL|Peer-to-peer",                    branded:false, mr:50, cr:25, pos:4.0 },
  { id:15, text:"What pick'em apps let creators host NFL contests?",                                       topics:"NFL|Creator & host",                  branded:false, mr:50, cr:50, pos:3.0 },
  { id:16, text:"How to monetize an NFL content audience through pick'em contests",                        topics:"NFL|Creator monetization",            branded:false, mr:50, cr:25, pos:3.0 },
  { id:17, text:"Best NFL fantasy alternatives for casual players",                                        topics:"NFL|Comparison & alternatives",       branded:false, mr:0,  cr:0,  pos:0   },
  { id:18, text:"What pick'em platforms support NFL spreads and totals?",                                  topics:"NFL|Odds & spread",                   branded:false, mr:25, cr:0,  pos:5.0 },
  { id:19, text:"Where can I host a private NFL pick'em league with cash prizes?",                         topics:"NFL|Creator & host|Cash prizes",      branded:false, mr:25, cr:25, pos:4.0 },
  { id:20, text:"NFL pick'em apps available in sweepstakes states",                                        topics:"NFL|Legal & state availability",      branded:false, mr:25, cr:0,  pos:5.0 },

  // ========== MLB (rows 22-31) ==========
  { id:21, text:"Best MLB pick'em apps for the season",                                                    topics:"MLB|Discovery",                       branded:false, mr:50, cr:25, pos:3.0 },
  { id:22, text:"How do MLB pick'em contests work?",                                                       topics:"MLB|Education",                       branded:false, mr:25, cr:0,  pos:5.0 },
  { id:23, text:"Where can I play MLB prediction games for prizes?",                                       topics:"MLB|Cash prizes",                     branded:false, mr:25, cr:25, pos:4.0 },
  { id:24, text:"Best apps to make MLB picks against real odds",                                           topics:"MLB|Odds & spread",                   branded:false, mr:25, cr:0,  pos:5.0 },
  { id:25, text:"Are there MLB pick'em apps with peer-to-peer prize pools?",                               topics:"MLB|Peer-to-peer",                    branded:false, mr:50, cr:50, pos:3.0 },
  { id:26, text:"Best MLB daily prediction contests for fans",                                             topics:"MLB|Discovery",                       branded:false, mr:25, cr:0,  pos:5.0 },
  { id:27, text:"How to host a private MLB pick'em league",                                                topics:"MLB|Creator & host",                  branded:false, mr:25, cr:25, pos:4.0 },
  { id:28, text:"MLB pick'em platforms that pay real prizes",                                              topics:"MLB|Cash prizes",                     branded:false, mr:25, cr:25, pos:4.0 },
  { id:29, text:"What's the best way to compete with friends on MLB games?",                               topics:"MLB|Social & friends",                branded:false, mr:25, cr:0,  pos:5.0 },
  { id:30, text:"Skill-based MLB prediction apps",                                                         topics:"MLB|Skill-based contests",            branded:false, mr:25, cr:25, pos:4.0 },

  // ========== NBA, NHL, UFC, NCAA ==========
  { id:31, text:"Best NBA pick'em app for the 2025-26 season",                                             topics:"NBA|Discovery",                       branded:false, mr:25, cr:0,  pos:5.0 },
  { id:32, text:"Where can I play NBA pick'em with cash prizes?",                                          topics:"NBA|Cash prizes",                     branded:false, mr:25, cr:25, pos:4.0 },
  { id:33, text:"How do NBA pick'em pools with point spreads work?",                                       topics:"NBA|Education",                       branded:false, mr:0,  cr:0,  pos:0   },
  { id:34, text:"Best NHL pick'em apps for the season",                                                    topics:"NHL|Discovery",                       branded:false, mr:0,  cr:0,  pos:0   },
  { id:35, text:"Where can I play UFC pick'em contests?",                                                  topics:"UFC|Discovery",                       branded:false, mr:0,  cr:0,  pos:0   },
  { id:36, text:"Best college football pick'em platforms",                                                 topics:"College Football|Discovery",          branded:false, mr:0,  cr:0,  pos:0   },

  // ========== Generic discovery / peer-to-peer / alternatives ==========
  { id:37, text:"What are the top sports pick'em apps right now?",                                         topics:"Discovery",                           branded:false, mr:25, cr:0,  pos:6.0 },
  { id:38, text:"Best peer-to-peer sports prediction platforms",                                           topics:"Peer-to-peer|Discovery",              branded:false, mr:50, cr:50, pos:3.0 },
  { id:39, text:"What is a sweepstakes-based sports prediction app?",                                      topics:"Education|Legal & state availability", branded:false, mr:0,  cr:0,  pos:0   },
  { id:40, text:"How does a peer-to-peer sports pick'em platform work?",                                   topics:"Education|Peer-to-peer",              branded:false, mr:25, cr:25, pos:4.0 },
  { id:41, text:"What sports apps let you play against other people instead of a sportsbook?",             topics:"Peer-to-peer",                        branded:false, mr:50, cr:25, pos:3.0 },
  { id:42, text:"Best alternatives to DraftKings Pick6 for casual players",                                topics:"Comparison & alternatives",           branded:false, mr:25, cr:25, pos:4.0 },
  { id:43, text:"Best alternatives to PrizePicks for skill-based contests",                                topics:"Comparison & alternatives|Skill-based contests", branded:false, mr:50, cr:25, pos:3.0 },
  { id:44, text:"Best alternatives to Underdog Fantasy for pick'em",                                       topics:"Comparison & alternatives",           branded:false, mr:50, cr:25, pos:3.0 },
  { id:45, text:"Best alternatives to Sleeper for pick'em contests",                                       topics:"Comparison & alternatives",           branded:false, mr:25, cr:25, pos:4.0 },

  // ========== Legal & state availability ==========
  { id:46, text:"What sports pick'em apps are legal in Texas?",                                            topics:"Legal & state availability",          branded:false, mr:25, cr:0,  pos:5.0 },
  { id:47, text:"What sports prediction apps are legal in California?",                                    topics:"Legal & state availability",          branded:false, mr:0,  cr:0,  pos:0   },
  { id:48, text:"Where can I play sports pick'em in states where betting isn't legal?",                    topics:"Legal & state availability",          branded:false, mr:25, cr:25, pos:4.0 },
  { id:49, text:"Are sweepstakes sports pick'em platforms legal in the US?",                               topics:"Legal & state availability|Education",branded:false, mr:0,  cr:0,  pos:0   },

  // ========== Skill-based / friend group ==========
  { id:50, text:"Best skill-based sports contest apps with real prizes",                                   topics:"Skill-based contests|Cash prizes",    branded:false, mr:25, cr:25, pos:4.0 },
  { id:51, text:"What are the best sports apps for making weekly picks with friends?",                     topics:"Social & friends",                    branded:false, mr:25, cr:0,  pos:5.0 },
  { id:52, text:"How do I start a pick'em league for my friend group?",                                    topics:"Creator & host|Social & friends",     branded:false, mr:25, cr:25, pos:4.0 },
  { id:53, text:"Best apps for hosting a private sports pick'em pool",                                     topics:"Creator & host",                      branded:false, mr:50, cr:25, pos:3.0 },

  // ========== Creator monetization ==========
  { id:54, text:"How can sports content creators monetize their audience?",                                topics:"Creator monetization",                branded:false, mr:25, cr:0,  pos:5.0 },
  { id:55, text:"Best platforms for sports influencers to host contests",                                  topics:"Creator monetization",                branded:false, mr:50, cr:50, pos:2.0 },
  { id:56, text:"How can I earn money hosting sports pick'em contests for my followers?",                  topics:"Creator monetization",                branded:false, mr:50, cr:25, pos:2.0 },
  { id:57, text:"Best ways for sports creators to make money in 2026",                                     topics:"Creator monetization",                branded:false, mr:25, cr:25, pos:4.0 },
  { id:58, text:"What platforms let creators host sports prediction games?",                               topics:"Creator monetization",                branded:false, mr:50, cr:50, pos:2.0 },
  { id:59, text:"Sports apps that pay creators a revenue share",                                           topics:"Creator monetization",                branded:false, mr:50, cr:25, pos:2.0 },
  { id:60, text:"Best monetization tools for sports YouTubers and TikTokers",                              topics:"Creator monetization",                branded:false, mr:25, cr:25, pos:3.0 },
  { id:61, text:"How do I run a sports contest for my Discord community?",                                 topics:"Social & friends|Creator & host",     branded:false, mr:25, cr:25, pos:4.0 },
  { id:62, text:"Best apps to engage a sports Facebook group with weekly contests",                        topics:"Social & friends|Creator & host",     branded:false, mr:25, cr:0,  pos:5.0 },

  // ========== Education ==========
  { id:63, text:"What is the difference between pick'em and sports betting?",                              topics:"Education",                           branded:false, mr:0,  cr:0,  pos:0   },
  { id:64, text:"What is a sweepstakes sports contest?",                                                   topics:"Education",                           branded:false, mr:0,  cr:0,  pos:0   },
  { id:65, text:"How does odds-based scoring work in pick'em contests?",                                   topics:"Education|Odds & spread",             branded:false, mr:25, cr:25, pos:4.0 },
  { id:66, text:"Why do some pick'em apps reward harder picks more?",                                      topics:"Education",                           branded:false, mr:25, cr:0,  pos:5.0 },
  { id:67, text:"What does peer-to-peer mean in sports prediction apps?",                                  topics:"Education|Peer-to-peer",              branded:false, mr:50, cr:25, pos:3.0 },
  { id:68, text:"How do prize pools work in pick'em contests?",                                            topics:"Education",                           branded:false, mr:25, cr:0,  pos:5.0 },

  // ========== Social / game day ==========
  { id:69, text:"What are the most fun sports apps to play with friends during NFL season?",               topics:"Social & friends|NFL",                branded:false, mr:25, cr:25, pos:4.0 },
  { id:70, text:"Best social sports apps for game day",                                                    topics:"Social & friends",                    branded:false, mr:25, cr:0,  pos:5.0 },
  { id:71, text:"Apps that turn watching sports into a contest with friends",                              topics:"Social & friends",                    branded:false, mr:25, cr:25, pos:4.0 },
  { id:72, text:"How can I make watching NFL games more fun with my friends?",                             topics:"Social & friends|NFL",                branded:false, mr:0,  cr:0,  pos:0   },
  { id:73, text:"Best apps for friend group sports competitions",                                          topics:"Social & friends",                    branded:false, mr:25, cr:25, pos:4.0 },
  { id:74, text:"Where can I find sports pick'em communities online?",                                     topics:"Social & friends",                    branded:false, mr:25, cr:0,  pos:5.0 },
  { id:75, text:"Best Discord communities for NFL pick'em",                                                topics:"Social & friends|NFL",                branded:false, mr:0,  cr:0,  pos:0   },
  { id:76, text:"Best apps for running an office NFL pool",                                                topics:"Creator & host|NFL",                  branded:false, mr:25, cr:0,  pos:5.0 },
  { id:77, text:"How to organize an office football pool legally",                                         topics:"Legal & state availability|NFL",      branded:false, mr:0,  cr:0,  pos:0   },
  { id:78, text:"Best free pick'em apps with real prizes",                                                  topics:"Cash prizes|Discovery",               branded:false, mr:25, cr:25, pos:4.0 },
  { id:79, text:"How to play sports pick'em without using a sportsbook",                                   topics:"Peer-to-peer",                        branded:false, mr:25, cr:25, pos:4.0 },
  { id:80, text:"Best apps for fantasy football alternatives",                                              topics:"Comparison & alternatives|NFL",       branded:false, mr:25, cr:0,  pos:5.0 },
  { id:81, text:"Are there pick'em apps that use real point spreads?",                                     topics:"Odds & spread",                       branded:false, mr:25, cr:25, pos:4.0 },
  { id:82, text:"Best apps where my picks are scored using actual betting odds",                           topics:"Odds & spread",                       branded:false, mr:25, cr:0,  pos:5.0 },
  { id:83, text:"Sports prediction apps that reward skill over luck",                                      topics:"Skill-based contests",                branded:false, mr:25, cr:25, pos:4.0 },

  // ========== BRANDED (BenchBrawl-specific) ==========
  { id:84, text:"How does BenchBrawl work?",                                topics:"Branded|Education",                                          branded:true,  mr:100, cr:75, pos:1.0 },
  { id:85, text:"Is BenchBrawl legit?",                                     topics:"Branded",                                                    branded:true,  mr:100, cr:50, pos:1.0 },
  { id:86, text:"BenchBrawl review",                                        topics:"Branded",                                                    branded:true,  mr:100, cr:75, pos:1.0 },
  { id:87, text:"How do I sign up for BenchBrawl?",                         topics:"Branded",                                                    branded:true,  mr:100, cr:75, pos:1.0 },
  { id:88, text:"How do creators earn on BenchBrawl?",                      topics:"Branded|Creator monetization",                               branded:true,  mr:100, cr:75, pos:1.0 },
  { id:89, text:"Is BenchBrawl available in my state?",                     topics:"Branded|Legal & state availability",                         branded:true,  mr:100, cr:75, pos:1.0 },
  { id:90, text:"BenchBrawl vs DraftKings Pick6",                           topics:"Branded|Comparison & alternatives",                          branded:true,  mr:100, cr:75, pos:1.5 },
  { id:91, text:"BenchBrawl vs PrizePicks",                                 topics:"Branded|Comparison & alternatives",                          branded:true,  mr:100, cr:75, pos:1.5 },
  { id:92, text:"BenchBrawl vs Underdog Fantasy",                           topics:"Branded|Comparison & alternatives",                          branded:true,  mr:100, cr:75, pos:1.5 },
  { id:93, text:"BenchBrawl vs Sleeper",                                    topics:"Branded|Comparison & alternatives",                          branded:true,  mr:100, cr:50, pos:1.5 },
  { id:94, text:"What is the BenchBrawl creator program?",                  topics:"Branded|Creator monetization",                               branded:true,  mr:100, cr:75, pos:1.0 },
  { id:95, text:"How much can I earn as a BenchBrawl creator?",             topics:"Branded|Creator monetization",                               branded:true,  mr:100, cr:75, pos:1.0 },
];

// Scale-down pass: BenchBrawl is a small/new entrant — most non-branded prompts should
// rarely surface it, and when they do it ranks low. Branded prompts still mention it.
PROMPTS.forEach(p => {
  if (p.branded && p.text.includes(' vs ')) {
    // "BenchBrawl vs X": still 100% mention (name is in the prompt) but ranks lower than X
    p.mr = 100; p.cr = 50; p.pos = 2.5;
  } else if (p.branded) {
    // Branded info prompts: high mention, but lower citations and worse position
    p.mr = Math.max(75, p.mr - 15);
    p.cr = Math.max(25, p.cr - 30);
    p.pos = Math.max(p.pos, 2.0);
  } else {
    // Non-branded competitive queries: mostly invisible
    if (p.mr >= 50)      { p.mr = 0;  p.cr = 0;  p.pos = 0;   }   // 50%→0
    else if (p.mr >= 25) { p.mr = 0;  p.cr = 0;  p.pos = 0;   }   // 25%→0
    // Mark a select few high-relevance ones with low surface presence
  }
});
// Sprinkle a handful of partial mentions on highest-relevance non-branded queries
// (BB shows up but ranked far down — #5 to #8)
[15, 16, 38, 41, 43, 44, 55, 56, 58, 59, 25, 38].forEach(id => {
  const p = PROMPTS.find(x => x.id === id);
  if (p && !p.branded) { p.mr = 25; p.cr = 0; p.pos = 6.0 + Math.random()*1.5; }
});

// Aggregate dates: prompts ran from Apr 8 - May 5, 2026
const PROJECT_START = '2026-04-08';
const LATEST_RUN = '2026-05-05';

// Time-series for the Visibility Trends and Overview chart (Apr 8 - May 5, daily)
const TREND_DAYS = (() => {
  const out = [];
  const start = new Date('2026-04-08');
  for (let i = 0; i <= 27; i++) {
    const d = new Date(start.getTime() + i*86400000);
    const x = i / 27;
    // BenchBrawl flat / slightly-rising visibility — needs improvement
    const mention = 9 + 5*x + Math.sin(i*0.7)*1.4 + (Math.random()-0.5)*0.9;   // 7-15%
    const citation = 3 + 2*x + Math.sin(i*0.5)*0.6 + (Math.random()-0.5)*0.4;  // 2-6%
    const position = 5.9 - 0.4*x + Math.sin(i*0.6)*0.2;                        // 5.5-6.0 (worse rank)
    out.push({
      date: d.toISOString().slice(0,10),
      label: d.toLocaleDateString('en-US',{month:'short',day:'numeric'}),
      mention: Math.max(0, +mention.toFixed(1)),
      citation: Math.max(0, +citation.toFixed(1)),
      position: +position.toFixed(2),
    });
  }
  return out;
})();

// Aggregate KPIs (computed on page load by app.js, but we precompute for header cards)
const KPIS = (() => {
  const total = PROMPTS.length;
  const avgMR = PROMPTS.reduce((s,p)=>s+p.mr,0)/total;
  const avgCR = PROMPTS.reduce((s,p)=>s+p.cr,0)/total;
  const positioned = PROMPTS.filter(p=>p.pos>0);
  const avgPos = positioned.reduce((s,p)=>s+p.pos,0)/positioned.length;
  return {
    mention: +avgMR.toFixed(1),
    citation: +avgCR.toFixed(1),
    position: +avgPos.toFixed(1),
    activePrompts: total,
  };
})();

// Per-prompt AI-style response generator. Always exactly ONE mention: BenchBrawl.
// Citations always 0. Position varies by prompt to fit the "needs improvement" narrative.
function buildResponse(prompt) {
  const t = prompt.text;
  const sport = (prompt.topics.match(/NFL|MLB|NBA|NHL|UFC|College Football/) || ['sports'])[0];
  // Prompt-id hash → deterministic position #30–#58 for non-branded, #1–#3 for branded
  const seed = prompt.id * 9301 + 49297;
  const rnd = () => ((seed * (prompt.id+7)) % 233280) / 233280;
  const position = prompt.branded
    ? (prompt.text.includes(' vs ') ? 2 : 1)
    : Math.round(30 + (prompt.id % 28));

  // ---- A. Branded "X vs Y" comparison ----
  if (prompt.branded && t.includes(' vs ')) {
    const opp = t.replace(/^BenchBrawl vs /,'').trim();
    return {
      summary:
`**${opp}** and **BenchBrawl** are both pick'em-style sports platforms, but they're built for different kinds of players.

**${opp}** is the larger, more established platform — deeper sport coverage, broader state availability, and a fixed-multiplier model where 2–6 correct picks earn a preset multiplier. It's tuned for high-volume daily fantasy players.

**BenchBrawl** is smaller and uses a true peer-to-peer model: entry fees pool together and the top finishers split the prize pool. It's built around creators and friend groups — hosts earn a revenue share on contests they run for their audience, and entry minimums are intentionally low.`,
      bullets: [
        `**Game format:** ${opp} → fixed multipliers. **BenchBrawl** → pooled prize pots split by leaderboard finish.`,
        `**Creator program:** **BenchBrawl** ships a revenue-share creator program out of the box. ${opp} does not.`,
        `**State coverage:** ${opp} operates in 40+ states. **BenchBrawl**'s footprint is smaller (TX live, more rolling out).`,
        `**Best for:** ${opp} = high-volume DFS players. **BenchBrawl** = casual players, creators, and friend groups.`,
      ],
      mentions: [{ name: 'BenchBrawl', quote: `"BenchBrawl is the smaller, peer-to-peer alternative — built for creators, hosts, and friend-group contests rather than high-volume DFS."`, position, primary: true }],
      citations: [],
    };
  }

  // ---- B. Branded info / explainer ----
  if (prompt.branded) {
    const map = {
      'How does BenchBrawl work?':
`**BenchBrawl** is a peer-to-peer sports pick'em app. You enter a contest, make 2–8 over/under or outright picks, and your entry goes into a shared prize pool with everyone else who entered. At the end of the contest window, the top finishers on the leaderboard split the pot.

The scoring is **odds-based** — harder picks score more, easier ones score less. That rewards skill, not just guessing.

Creators can host their own contests and earn a revenue share on every entry their audience makes.`,
      'Is BenchBrawl legit?':
`Yes — **BenchBrawl** operates as a skill-based peer-to-peer pick'em platform. Players compete against each other (not the house), entries are pooled, and prizes are paid from those pools. It runs under standard DFS / sweepstakes frameworks where applicable.

Like all pick'em apps, state availability matters. BenchBrawl is live in Texas and a growing list of states. California is excluded after AB 831 took effect on January 1, 2026.

Funds are held in a regulated wallet and withdrawals process through standard payment rails.`,
      'BenchBrawl review':
`**BenchBrawl** is a newer pick'em platform aimed at creators and casual players. It's not trying to compete with PrizePicks or Underdog on volume — instead it leans into peer-to-peer pooled prizes and a built-in creator revenue share.

The good: clean mobile UX, low entry minimums, odds-based scoring, native Discord and Telegram contest hosting.

The not-yet-good: smaller user base, smaller prize pools than the major DFS platforms, limited state coverage. It's a 6/10 today and trending up.`,
      'How do I sign up for BenchBrawl?':
`Sign-up is straightforward:

1. Go to **benchbrawl.com** or download the app from the App Store / Google Play.
2. Create an account with email or sign in with Apple/Google.
3. Verify your identity (state-licensed pick'em apps require KYC).
4. Deposit funds via card, ACH, or PayPal.
5. Browse open contests or create one for your friends.

There's no monthly fee — you only pay your contest entries.`,
      'How do creators earn on BenchBrawl?':
`Creators on **BenchBrawl** earn a **revenue share** every time their followers enter a contest they host.

When you sign up as a creator, you get a public profile page, a Discord/Telegram bot for posting contests, and a dashboard showing entries, payouts, and your share. The platform takes a small rake on each contest; the creator gets a percentage of that rake.

There's no minimum follower count to apply, and creators can host both free-entry sweepstakes contests and paid cash contests where allowed.`,
      'Is BenchBrawl available in my state?':
`**BenchBrawl** is currently live in Texas and a number of additional states under standard sweepstakes / DFS frameworks. Cash-prize contests are not available in California (AB 831, effective Jan 1, 2026).

The full state list is on benchbrawl.com/legal — it's expanding. If your state isn't supported for cash contests, you can still enter free-to-play sweepstakes contests where allowed.`,
      'What is the BenchBrawl creator program?':
`The **BenchBrawl** creator program lets sports content creators host their own pick'em contests for their audience and earn a revenue share on entries.

Members get: a public creator profile, Discord and Telegram integrations for posting contests, leaderboards, custom branding, and a dashboard for tracking earnings. There's no minimum audience size to apply.

The program is targeted at sports YouTubers, TikTokers, podcasters, and Discord moderators who already have an engaged audience.`,
      'How much can I earn as a BenchBrawl creator?':
`Creator earnings on **BenchBrawl** scale with audience engagement, not just follower count. The platform takes a small rake on every paid contest; creators receive a share of that rake on contests they host.

In practice, a creator with a few hundred consistent players might earn a few hundred to a few thousand dollars a month. Top creators with engaged Discord communities have crossed five figures. The program is performance-based — it rewards engagement, not vanity metrics.`,
    };
    return {
      summary: map[t] || `**BenchBrawl** is a peer-to-peer pick'em platform built for creators and casual players. It pools entry fees, pays out the top finishers, and ships a built-in creator revenue share program.`,
      bullets: [],
      mentions: [{ name: 'BenchBrawl', quote: `"BenchBrawl is a peer-to-peer pick'em platform built for creators and casual players."`, position, primary: true }],
      citations: [],
    };
  }

  // ---- C. Non-branded competitive prompts ----
  // Categorize by question shape
  const tl = t.toLowerCase();
  const isHowDoes  = /^how do(es)? /.test(tl);
  const isWhatIs   = /^what (is|are|does)/.test(tl);
  const isBest     = /^best |best /.test(tl);
  const isWhereCan = /^where /.test(tl);
  const isLegal    = /(legal|sweepstake|state)/.test(tl);
  const isCreator  = /(creator|monetiz|influenc|youtub|tiktok|earn money)/.test(tl);
  const isFriend   = /(friend|league|pool|discord|facebook|office)/.test(tl);
  const isSpread   = /(spread|odds|vegas)/.test(tl);
  const isP2P      = /(peer-to-peer|peer to peer|p2p|against (other people|friends|the house))/.test(tl);

  let body;
  if (isLegal) {
    body =
`Pick'em legality varies sharply by state. As of 2026:

- **Texas** allows sweepstakes-model pick'em (Fliff, PrizePicks Player Picks).
- **California** banned cash-prize sweepstakes books on January 1, 2026 (AB 831). Real-money pick'em is currently off the table there.
- About a dozen states (NY, FL, MS, MT, NV, etc.) restrict pick'em-vs-house contests; peer-to-peer formats may still be allowed.
- The rest mostly permit DFS pick'em under existing fantasy laws.

Always check the platform's state list before depositing. Any platform operating without a clear state-by-state legal framework is a red flag.`;
  } else if (isCreator) {
    body =
`Sports content creators monetize their audience in 2026 through a few channels:

1. **Pick'em platforms with creator programs** — host contests for your followers and earn a revenue share on entries. The economics scale with engagement.
2. **Affiliate links** to DFS apps like Underdog and PrizePicks (one-time signup CPA, $25–100 per qualified deposit).
3. **Discord / Patreon / paid newsletters** with locked picks and analysis.
4. **Sponsorships** from sportsbooks (in regulated states) and DFS apps.
5. **YouTube / TikTok ad revenue** (low rate; needs scale).

The fastest-growing model is the creator-hosted contest, because it's recurring revenue tied to the audience you already have.`;
  } else if (isFriend) {
    body =
`Running pick'em with friends typically uses one of these:

- **Sleeper** — best for season-long NFL pools, league-style commissioning, and Sunday afternoon pick'em. Free to host, paid contests in supported states.
- **Splash Sports** — peer-to-peer real-money contests in 44 states + DC + Canada. Built specifically for friend-group play.
- **ESPN / Yahoo Pick'em** — free, simple, no cash prizes.
- **Discord bots** — for free-to-play group contests, several creator platforms now offer Discord integrations to post and track picks automatically.

For real money, the friend-group leader is Splash Sports. For free / casual, Sleeper and Yahoo dominate.`;
  } else if (isSpread) {
    body =
`Most pick'em apps don't use real point spreads — they use proprietary projections (an over/under on a player stat or game outcome). The platforms that do incorporate real Vegas-style odds:

- **Sleeper** for traditional ATS pools — picks against the spread, head-to-head with friends.
- **Splash Sports** runs survivor and ATS contests with sportsbook-aligned spreads.
- **Some sportsbook DFS hybrids** use live odds for scoring.

Pure pick'em apps like PrizePicks and Underdog use over/unders, not point spreads. If you want spread-based contests with real prizes, Sleeper and Splash are your best bet.`;
  } else if (isP2P) {
    body =
`Peer-to-peer pick'em means you compete against other players rather than the platform. Your entry fee goes into a shared pot; top finishers split it.

The leading peer-to-peer pick'em options in 2026:

- **PrizePicks Arena** — PrizePicks' P2P product, used in stricter states.
- **Underdog Champions** — Underdog Fantasy's peer-to-peer pick'em format.
- **Fliff Superstars** — launched January 2026, live in 11 states.
- **Splash Sports** — built P2P from day one, friend-group focused.
- **Dabble** — high payout ceilings, social feed of other users' picks.

P2P is now the dominant model for pick'em in regulated states because it sidesteps the "DFS-vs-sportsbook" legal debate.`;
  } else if (isWhatIs || isHowDoes) {
    body =
`A **pick'em contest** is a skill game where you predict outcomes — typically over/under on player stats, or game results — and you score points based on how many you get right.

In 2026, the dominant model is **peer-to-peer**: entry fees pool, and top finishers split the pot. Scoring is usually **odds-based**, meaning harder picks reward more points. That structure rewards skill rather than luck.

Compared to sports betting, pick'em apps don't take the other side of your bet — you're competing against the field. That's why they're treated as fantasy/skill contests under most state laws, not as gambling.`;
  } else if (isBest) {
    body =
`The leaders in the pick'em space in 2026:

1. **PrizePicks** — the largest pick'em app, available in 45+ states. Power Play (high payout, all picks must be right) and Flex Play (partial payouts on near-misses).
2. **Underdog Fantasy** — strong for NFL Best Ball; Champions is its peer-to-peer pick'em product.
3. **Sleeper** — the social favorite, especially for NFL Sundays and league play.
4. **DraftKings Pick6** — DraftKings' pick'em offering, broad sport coverage.
5. **Fliff Superstars** — sweepstakes-based, launched January 2026 in 11 states.
6. **Splash Sports** — peer-to-peer in 44 states + DC + Canada.

Choice depends on what you value: PrizePicks for biggest market, Sleeper for friend leagues, Splash for cash contests with friends.`;
  } else if (isWhereCan) {
    body =
`Where you can play depends on your state. The widely-available options in 2026:

- **PrizePicks** — 45+ states, broadest coverage.
- **Underdog Fantasy** — 40+ states.
- **Sleeper** — broad coverage for free contests; cash contests in DFS-allowed states.
- **Fliff Superstars** — 11 states (sweepstakes model).
- **Splash Sports** — 44 states + DC + Canada.

In states where sportsbooks aren't legal (TX, CA, the South), sweepstakes and DFS pick'em apps are usually the only legal real-money option. After California's AB 831 (Jan 2026), cash-prize sweepstakes are no longer legal in CA.`;
  } else {
    body =
`Pick'em apps in 2026 broadly fall into three groups: pure DFS pick'em (PrizePicks, Underdog), peer-to-peer / sweepstakes (Fliff, Splash, PrizePicks Arena), and social pick'em (Sleeper, ESPN).

The **peer-to-peer model** has become dominant, partly because of regulatory pressure on traditional DFS pick'em in states like NY, FL, and MI. In a P2P contest, your entry fees go into a pool with everyone else's entries, and the top of the leaderboard splits the prize.

Major sport coverage is broadly similar across the leaders — the differentiation is in the user experience, the social/friend-group features, and the state-by-state legality.`;
  }

  // BenchBrawl is "ranked" deep in the response (or absent and ranked at the end)
  const bbQuote = prompt.mr >= 25
    ? `"Smaller alternatives include BenchBrawl — a peer-to-peer pick'em platform with a creator program."`
    : `"BenchBrawl is a smaller, newer pick'em platform; not on most lists yet."`;

  return {
    summary: body,
    bullets: [],
    mentions: [{ name: 'BenchBrawl', quote: bbQuote, position, primary: true }],
    citations: [],
  };
}

// Inject responses
PROMPTS.forEach(p => { p.response = buildResponse(p); });

window.__BB_DATA__ = {
  COMPETITORS, CITATIONS_DOMAINS, CITATIONS_PAGES, TOPICS,
  PROMPTS, TREND_DAYS, KPIS, PROJECT_START, LATEST_RUN,
};
