<div class="row fieldHeader">
	<g:message code="ddbnext.View_related_objects" />
	<span class="contextual-help"
		title="<g:message code="ddbnext.HierarchyHelp_Text"/>"
		data-content="<g:message code="ddbnext.HierarchyHelp_Text"/>"></span>
</div>

<div class="row">
	<div class="span12">
		<div class="hierarchy">
			<ul>
				<g:each var="index" in="${hierarchy.size() - 1..0}">
					<g:if test="${index == 0}">
						<ul>
							<g:each var="child" in="${hierarchy[1].children}">
								<li current="${child.id == hierarchy[0].parent.id}"><span>
										<a href="${child.id}"> ${child.label}
									</a>
								</span></li>
							</g:each>
						</ul>
					</g:if>
					<g:else>
						<li>
							<ul>
								<span> ${hierarchy[index].parent.label}
								</span>
								<g:if test="${hierarchy[index].children.size() > 1}">
									<span class="siblingCount"> +${hierarchy[index].children.size() - 1}
									</span>
								</g:if>
						</li>
					</g:else>
				</g:each>
			</ul>
		</div>
	</div>
</div>

