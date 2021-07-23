<script>
    import Card from '$lib/Card.svelte';
    
    import { warehouses } from './data.js';
</script>

<!-- <div class="container-fluid px-0 pt-3 d-flex flex-column align-items-center"> -->
    <div id="search" class="row no-gutters mt-1">
        <div class="col d-flex justify-content-center position-relative">
            <img class="intro-image" src="/static/images/intro.png" alt="Find a space in the world">
            <h2 class="position-absolute">Find a space in the world</h2>
            <div class="position-absolute search-wrap">
                <div class="search-title">
                    <span class="title pointer">按城市</span>
                    <span class="ml-5 title active pointer">按亚马逊</span>
                </div>
                <div class="search-content mb-3">
                    <img src="/static/images/position.svg" class="ml-2" alt="">
                    <input class="ml-3 border-0" placeholder="请输入城市名称"/>
                    <div class="icon-bg rounded-circle ml-auto pointer">
						<a href="/list">
							<img src="/static/images/search.svg" alt="">
						</a>
					</div>
                </div>
                <div class="search-box d-none"><!-- 搜索框样式 -->
                    <div class="content-show">
                        <div class="left"><span class="active">多</span>伦多，安大略省，加拿大</div>
                        <div class="ml-auto">Toronto, Ontario, Canada</div>
                    </div>
                    <div class="content-show border-0">
                        <div class="left"><span class="active">多</span>伦多，安大略省，加拿大</div>
                        <div class="ml-auto">Toronto, Ontario, Canada</div>
                    </div>
                </div>
                <div class="search-box d-none"><!-- 搜索框样式没有搜索结果 -->
                    <div class="content-show no-result border-0">
                        没有相关搜索结果
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="amazon">
        <h3 class="text-center">亚马逊转运仓推荐</h3>
        <div class="d-flex justify-content-center mb-4">
            <div class="tag tag-chosen">
                YYZ1
            </div>
            <div class="tag ml-3">
                YYZ2
            </div>
            <div class="tag ml-3">
                YYZ3
            </div>
            <div class="tag ml-3">
                YYZ4
            </div>

        </div>

        <div class="row pt-2 no-gutters mb-5 pb-1">
        {#each warehouses as warehouse}
            <Card {...warehouse}></Card>
        {:else}
            <p>loading</p>
        {/each}
    
        </div>
    </div>

<!-- </div> -->
