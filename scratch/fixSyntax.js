const fs = require('fs');
let content = fs.readFileSync('apps/mobile/App.tsx', 'utf8');

const target = `                                      </View>
                              })}
                                            </View>
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                          );
                      })()}
                  </ScrollView>`;

const replacement = `                                      </View>
                              );
                            })}
                        </View>
                          );
                      })()}
                  </ScrollView>`;

content = content.replace(target, replacement);
fs.writeFileSync('apps/mobile/App.tsx', content);
console.log('Fixed syntax!');
